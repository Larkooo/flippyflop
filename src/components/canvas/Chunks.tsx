import { CHUNK_SIZE, TILE_MODEL_TAG, CHUNKS_PER_DIMENSION, WORLD_SIZE, ACTIONS_ADDRESS } from '@/constants'
import { parseModel, getChunkAndLocalPosition } from '@/utils'
import { useThree, useFrame } from '@react-three/fiber'
import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { Vector3, TextureLoader, MeshBasicMaterial, SRGBColorSpace } from 'three'
import { Chunk, Tile as TileModel } from '@/models'
import { useAccount, useProvider, useWaitForTransaction } from '@starknet-react/core'
import InstancedTiles from './InstancedTiles'

const RENDER_DISTANCE = 1 // Number of chunks to load in each direction

interface ChunksProps {
  entities: Record<string, TileModel>
}

export default function Chunks({ entities }: ChunksProps) {
  const [chunks, setChunks] = useState<Record<string, Chunk>>({})
  const { camera } = useThree()
  const [cameraChunk, setCameraChunk] = useState({ x: 0, y: 0, worldX: 0, worldY: 0 })
  const lastCameraPosition = useRef<Vector3>(camera.position.clone())
  const { account } = useAccount()
  const { provider } = useProvider()

  useEffect(() => {
    setChunks((prevChunks) => {
      const newChunks: Record<string, Chunk> = {}

      Object.values(entities).forEach((tile) => {
        const { chunkX, chunkY, localX, localY } = getChunkAndLocalPosition(tile.x, tile.y)
        const chunkKey = `${chunkX},${chunkY}`

        if (!newChunks[chunkKey]) {
          newChunks[chunkKey] = {
            x: chunkX % CHUNKS_PER_DIMENSION,
            y: chunkY % CHUNKS_PER_DIMENSION,
            worldX: chunkX,
            worldY: chunkY,
            tiles: Array.from({ length: CHUNK_SIZE * CHUNK_SIZE }).map((_, idx) => ({
              x: idx % CHUNK_SIZE,
              y: Math.floor(idx / CHUNK_SIZE),
              flipped: prevChunks[chunkKey]?.tiles[idx]?.flipped ?? '0x0',
            })),
          }
        }

        newChunks[chunkKey].tiles[localY * CHUNK_SIZE + localX] = {
          ...tile,
          x: localX,
          y: localY,
        }
      })

      return newChunks
    })
  }, [entities])

  console.log(chunks)

  const loadNeighboringChunks = useCallback(
    (centerX: number, centerY: number) => {
      setChunks((prevChunks) => {
        const newChunks = { ...prevChunks }
        for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
          for (let dy = -RENDER_DISTANCE; dy <= RENDER_DISTANCE; dy++) {
            const worldX = centerX + dx
            const worldY = centerY + dy
            const chunkKey = `${worldX},${worldY}`

            if (!newChunks[chunkKey]) {
              newChunks[chunkKey] = {
                x: ((worldX % CHUNKS_PER_DIMENSION) + CHUNKS_PER_DIMENSION) % CHUNKS_PER_DIMENSION,
                y: ((worldY % CHUNKS_PER_DIMENSION) + CHUNKS_PER_DIMENSION) % CHUNKS_PER_DIMENSION,
                worldX,
                worldY,
                tiles: Array.from({ length: CHUNK_SIZE * CHUNK_SIZE }).map((_, idx) => {
                  const localX = idx % CHUNK_SIZE
                  const localY = Math.floor(idx / CHUNK_SIZE)
                  const globalX =
                    (((worldX % CHUNKS_PER_DIMENSION) + CHUNKS_PER_DIMENSION) % CHUNKS_PER_DIMENSION) * CHUNK_SIZE +
                    localX
                  const globalY =
                    (((worldY % CHUNKS_PER_DIMENSION) + CHUNKS_PER_DIMENSION) % CHUNKS_PER_DIMENSION) * CHUNK_SIZE +
                    localY
                  return { x: localX, y: localY, flipped: entities?.[`${globalX},${globalY}`]?.flipped ?? '0x0' }
                }),
              }
            }
          }
        }
        return newChunks
      })
    },
    [entities],
  )

  const unloadDistantChunks = useCallback((centerX: number, centerY: number) => {
    setChunks((prevChunks) => {
      const newChunks = { ...prevChunks }
      Object.entries(newChunks).forEach(([key, chunk]) => {
        const [chunkWorldX, chunkWorldY] = key.split(',').map(Number)
        const distance = Math.max(Math.abs(chunkWorldX - centerX), Math.abs(chunkWorldY - centerY))
        if (distance > RENDER_DISTANCE + 1) {
          delete newChunks[key]
        }
      })
      return newChunks
    })
  }, [])

  useEffect(() => {
    if (!entities.length) return
    loadNeighboringChunks(cameraChunk.worldX, cameraChunk.worldY)
  }, [loadNeighboringChunks])

  useFrame(() => {
    const scaledPos = camera.position.clone().subScalar(50)
    const worldX = Math.floor(scaledPos.x / CHUNK_SIZE)
    const worldY = Math.floor(scaledPos.z / CHUNK_SIZE)
    const x = ((worldX % CHUNKS_PER_DIMENSION) + CHUNKS_PER_DIMENSION) % CHUNKS_PER_DIMENSION
    const y = ((worldY % CHUNKS_PER_DIMENSION) + CHUNKS_PER_DIMENSION) % CHUNKS_PER_DIMENSION

    setCameraChunk({ x, y, worldX, worldY })
    loadNeighboringChunks(worldX, worldY)
    unloadDistantChunks(worldX, worldY)

    lastCameraPosition.current = camera.position.clone()
  })

  const topTexture = useMemo(() => {
    const texture = new TextureLoader().load('/textures/Robot_Black_2x_Rounded.png')
    texture.colorSpace = SRGBColorSpace
    return texture
  }, [])
  const bottomTexture = useMemo(() => {
    const texture = new TextureLoader().load('/textures/Smiley_Orange_2x_Rounded.png')
    texture.colorSpace = SRGBColorSpace
    return texture
  }, [])

  const topMaterial = useMemo(() => new MeshBasicMaterial({ map: topTexture, transparent: true }), [topTexture])
  const bottomMaterial = useMemo(
    () => new MeshBasicMaterial({ map: bottomTexture, transparent: true }),
    [bottomTexture],
  )

  return Object.entries(chunks).map(([chunkKey, chunk]) => (
    <group
      key={chunkKey}
      position={[chunk.worldX * (CHUNK_SIZE + CHUNK_SIZE / 10), 0, chunk.worldY * (CHUNK_SIZE + CHUNK_SIZE / 10)]}
    >
      <InstancedTiles
        tiles={chunk.tiles}
        topMaterial={topMaterial}
        bottomMaterial={bottomMaterial}
        onClick={async (clickedTile) => {
          if (!account) return

          setChunks((prevChunks) => {
            const chunkKey = `${chunk.worldX},${chunk.worldY}`
            if (!prevChunks[chunkKey]) return prevChunks

            const tiles = [...prevChunks[chunkKey].tiles]
            tiles[clickedTile.y * CHUNK_SIZE + clickedTile.x] = {
              x: clickedTile.x,
              y: clickedTile.y,
              flipped: account.address,
            }
            prevChunks[chunkKey].tiles = tiles

            return { ...prevChunks }
          })

          try {
            const tx = await account.execute([
              {
                contractAddress: ACTIONS_ADDRESS,
                entrypoint: 'flip',
                calldata: [
                  '0x' + (chunk.x * CHUNK_SIZE + clickedTile.x).toString(16),
                  '0x' + (chunk.y * CHUNK_SIZE + clickedTile.y).toString(16),
                ],
              },
            ])

            const flipped = await provider.waitForTransaction(tx.transaction_hash)
            if (!flipped.isSuccess()) {
              setChunks((prevChunks) => {
                const chunkKey = `${chunk.worldX},${chunk.worldY}`
                if (!prevChunks[chunkKey]) return prevChunks

                const tiles = [...prevChunks[chunkKey].tiles]
                tiles[clickedTile.y * CHUNK_SIZE + clickedTile.x] = {
                  x: clickedTile.x,
                  y: clickedTile.y,
                  flipped: '0x0',
                }
                prevChunks[chunkKey].tiles = tiles

                return { ...prevChunks }
              })
            }

            return true
          } catch (e) {
            return false
          }
        }}
      />
    </group>
  ))
}
