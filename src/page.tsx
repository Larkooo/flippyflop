import { useEffect, useRef, useState } from 'react'
import { NoToneMapping, Scene as ThreeScene } from 'three'
import { Canvas } from '@react-three/fiber'
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'
import useSound from 'use-sound'
import FlipSound from '@/../public/sfx/flip.mp3'

import { WORLD_SIZE } from '@/constants'
import { useClient } from '@/hooks/useClient'
import { useTiles } from '@/hooks/useTiles'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useFlip } from '@/hooks/useFlip'
import { UsernamesProvider, useUsernames } from '@/contexts/UsernamesContext'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

import Header from '@/components/dom/Header'
import FlipButton from '@/components/dom/FlipButton'
import Scene from '@/components/canvas/Scene'
import { Powerup } from './models'
import { maskAddress } from './utils'

export default function Page() {
  const { client } = useClient()
  const { tiles, setTiles } = useTiles(client)
  const { address } = useAccount()
  const { leaderboard } = useLeaderboard(tiles)

  const camera = useRef()
  const controlsRef = useRef()
  const scene = useRef<ThreeScene>()

  const userScore = Object.values(tiles)
    .filter((tile) => tile.address === (address ? maskAddress(address) : undefined))
    .reduce((score, tile) => {
      return score + (tile.powerup === Powerup.Multiplier ? tile.powerupValue : 1)
    }, 0)
  const humanScore = Object.values(tiles).filter((tile) => tile.address !== '0x0').length
  const botScore = WORLD_SIZE * WORLD_SIZE - humanScore

  const [playFlipSound] = useSound(FlipSound)
  const { handleFlip } = useFlip({ scene, camera, tiles, setTiles, playFlipSound, controlsRef })

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine)
      //await loadBasic(engine);
    })
  }, [])

  return (
    <>
      <Header userScore={userScore} humanScore={humanScore} botScore={botScore} leaderboard={leaderboard} />
      <FlipButton className='fixed bottom-6 left-1/2 z-20 -translate-x-1/2' onClick={handleFlip} />
      <div className='h-screen w-screen'>
        <Canvas gl={{ toneMapping: NoToneMapping }}>
          <Scene
            sceneRef={scene}
            tiles={tiles}
            cameraRef={camera}
            setTiles={setTiles}
            playFlipSound={playFlipSound}
            controlsRef={controlsRef}
          />
        </Canvas>
      </div>
    </>
  )
}
