'use client'

import {
  TORII_URL,
  TORII_RPC_URL,
  TORII_RELAY_URL,
  WORLD_ADDRESS,
  TILE_MODEL_TAG,
  CHUNK_SIZE,
  CHUNKS,
  WORLD_SIZE,
} from '@/constants'
import { fetchChunk, initializeChunk, parseModel } from 'src/utils'
import { Entity, Subscription } from 'dojo.c/pkg'
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useAsync } from 'react-async-hook'
import { Tile as TileModel } from 'src/models'
import { TextureLoader, Vector3 } from 'three'
import { useLoader, useThree } from '@react-three/fiber'
import CheckmarkIcon from '@/components/dom/CheckmarkIcon'
import FlipButton from '@/components/dom/FlipButton'
import FlippyFlop from '@/components/dom/FlippyFlop'
import Leaderboard from '@/components/dom/Leaderboard'
import OrangeButton from '@/components/dom/OrangeButton'
import Scorebar from '@/components/dom/Scorebar'
import UserIcon from '@/components/dom/UserIcon'
import { useWasm } from '@/components/dom/WasmContext'

const Chunks = dynamic(() => import('@/components/canvas/Chunks').then((mod) => mod.default), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 size-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  const { wasmRuntime, client } = useWasm()
  const subscription = useRef<Subscription>()
  const [tiles, setTiles] = useState<Record<string, TileModel>>({})

  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)

  useEffect(() => {
    if (!wasmRuntime) return

    setProvider(wasmRuntime.createProvider(TORII_RPC_URL))
  }, [wasmRuntime])

  useEffect(() => {
    if (!provider) return

    provider
      .createAccount(
        '0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a',
        '0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca',
      )
      .then(setAccount)
  }, [provider])

  useEffect(() => {
    if (!client) return

    client
      .getEntities({
        clause: {
          Keys: {
            keys: [undefined],
            pattern_matching: 'VariableLen',
            models: [TILE_MODEL_TAG],
          },
        },
        limit: 10000,
        offset: 0,
      })
      .then(async (entities) => {
        const tiles = {}
        for (const entity of Object.values(entities)) {
          const tile = parseModel<TileModel>(entity[TILE_MODEL_TAG])
          tiles[`${tile.x},${tile.y}`] = tile
        }
        setTiles(tiles)

        subscription.current = await client.onEntityUpdated(
          [
            {
              Keys: {
                keys: [],
                pattern_matching: 'VariableLen',
                models: [TILE_MODEL_TAG, 'flippyflop-User'],
              },
            },
          ],
          (_hashed_keys: string, entity: Entity) => {
            if (entity[TILE_MODEL_TAG]) {
              const tile = parseModel<TileModel>(entity[TILE_MODEL_TAG])
              setTiles((prev) => ({ ...prev, [`${tile.x},${tile.y}`]: tile }))
            }
          },
        )
      })
  }, [client])

  const humanScore = useMemo(() => Object.values(tiles).filter((tile) => tile.flipped !== '0x0').length, [tiles])
  const botScore = useMemo(() => WORLD_SIZE * WORLD_SIZE - humanScore, [humanScore])

  return (
    <>
      <div className='pointer-events-none fixed top-0 z-20 flex w-full flex-col items-start justify-start gap-4 bg-gradient-to-b from-black/70 to-transparent p-4'>
        <div className='flex w-full items-start gap-12'>
          <div className='flex w-full flex-col justify-between gap-4'>
            <FlippyFlop className='' />
            <Scorebar className={'w-full'} humansScore={humanScore} botsScore={botScore} />
          </div>
          <div className='flex w-2/5 flex-col gap-4'>
            <div className='pointer-events-auto flex gap-4'>
              <OrangeButton className='' icon={<CheckmarkIcon className='' />} text={humanScore} />
              <OrangeButton className='w-full' icon={<UserIcon />} text={'nasr'} />
            </div>
            <Leaderboard
              scores={[
                {
                  name: 'nasr',
                  score: 10,
                },
                {
                  name: 'nasr',
                  score: 10,
                },
                {
                  name: 'nasr',
                  score: 10,
                },
                {
                  name: 'nasr',
                  score: 10,
                },
                {
                  name: 'nasr',
                  score: 10,
                },
              ]}
            />
          </div>
        </div>
      </div>
      <FlipButton
        className='fixed bottom-6 left-1/2 z-20 -translate-x-1/2'
        onClick={() => {
          console.log('flip')
        }}
      />
      <View className='flex h-screen w-full flex-col items-center justify-center'>
        <Suspense fallback={null}>
          <Chunks account={account} entities={tiles} provider={provider} />
          <Common color='#737782' />
        </Suspense>
      </View>
    </>
  )
}
