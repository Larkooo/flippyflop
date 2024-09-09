import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ShieldIcon from './ShieldIcon'
import { useAccount } from '@starknet-react/core'
import { formatAddress, maskAddress } from '../../utils'
import CoinsIcon from './CoinsIcon'
import Particles from '@tsparticles/react'
import useSound from 'use-sound'
import PartyHornSound from '@/../public/sfx/partyhorn.mp3'
import { useUsernames } from '@/contexts/UsernamesContext'

interface LeaderboardProps {
  className?: string
  scores: { address: string; score: number; position: number; type: 'score' | 'separator' }[]
}

const Leaderboard = ({ className, scores }: LeaderboardProps) => {
  const { account } = useAccount()
  const [prevScores, setPrevScores] = useState(scores)
  const maskedAddress = account ? maskAddress(account.address) : undefined
  const [showConfetti, setShowConfetti] = useState(false)
  const [shakeAddress, setShakeAddress] = useState<string | null>(null)
  const [partyHorn] = useSound(PartyHornSound)
  const { usernamesCache } = useUsernames()

  useEffect(() => {
    setPrevScores(scores)
    const currentPlayerScore = scores.find((s) => s.address === maskedAddress)
    const prevPlayerScore = prevScores.find((s) => s.address === maskedAddress)

    if (currentPlayerScore && prevPlayerScore && currentPlayerScore.position < prevPlayerScore.position) {
      partyHorn()
      setShowConfetti(true)
      setShakeAddress(maskedAddress)
      setTimeout(() => {
        setShowConfetti(false)
        setShakeAddress(null)
      }, 3000) // Hide confetti and stop shaking after 3 seconds
    }
  }, [scores, maskedAddress])

  const getPositionChange = (address: string) => {
    const prevPosition = prevScores.find((s) => s.address === address)?.position
    const currentPosition = scores.find((s) => s.address === address)?.position
    if (prevPosition === undefined || currentPosition === undefined) return 'none'
    return currentPosition < prevPosition ? 'up' : currentPosition > prevPosition ? 'down' : 'none'
  }

  return (
    <div
      className={`${className} flex w-full flex-col items-start gap-2 rounded-lg px-3 pb-3 pt-4 text-white backdrop-blur`}
      style={{
        background: 'rgba(8, 14, 19, 0.64)',
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.5)',
      }}
    >
      <span className='text-lg font-bold'>Leaderboard</span>
      <div className='flex flex-col items-start gap-2 self-stretch w-full'>
        <AnimatePresence>
          {scores.map((score, index) =>
            score.type === 'separator' ? (
              <div
                key={`separator-${index}`}
                className='flex w-full justify-center self-center'
                style={{
                  color: 'rgba(238, 238, 238, 0.60)',
                }}
              >
                ...
              </div>
            ) : (
              <motion.div
                key={score.address}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: getPositionChange(score.address) === 'up' ? [1, 1.05, 1] : 1,
                  x: shakeAddress === score.address ? [0, -5, 5, -5, 5, 0] : 0,
                }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className={`flex items-center justify-between self-stretch rounded-s p-2 w-full relative overflow-hidden`}
                style={{
                  background:
                    score.address === maskedAddress ? 'rgba(243, 131, 51, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                  color: score.address === maskedAddress ? 'rgba(243, 131, 51, 0.85)' : 'rgba(238, 238, 238, 0.90)',
                }}
              >
                {showConfetti && score.address === maskedAddress && (
                  <Particles
                    id='tsparticles'
                    options={{
                      particles: {
                        number: { value: 200, density: { enable: true, width: 800, height: 800 } },
                        color: { value: ['#FFD700', '#FFA500', '#FF4500', '#FF69B4', '#00CED1', '#32CD32'] },
                        shape: { type: ['circle', 'square', 'triangle'] },
                        opacity: {
                          value: { min: 0.3, max: 0.8 },
                          animation: {
                            enable: true,
                            speed: 0.5,
                            sync: false,
                            startValue: 'max',
                            destroy: 'min',
                          },
                        },
                        size: { value: { min: 3, max: 8 } },
                        life: {
                          duration: {
                            sync: false,
                            value: 3,
                          },
                          count: 1,
                        },
                        move: {
                          enable: true,
                          direction: 'top',
                          outModes: 'out',
                          speed: { min: 2, max: 8 },
                          gravity: { enable: true, acceleration: 0.5 },
                          random: true,
                          straight: false,
                          attract: { enable: false, rotate: { x: 600, y: 1200 } },
                        },
                        rotate: {
                          value: { min: 0, max: 360 },
                          direction: 'random',
                          animation: { enable: true, speed: 10 },
                        },
                        tilt: {
                          direction: 'random',
                          enable: true,
                          value: { min: 0, max: 360 },
                          animation: { enable: true, speed: 10 },
                        },
                      },
                      detectRetina: true,
                    }}
                    className='absolute inset-0 pointer-events-none z-10'
                  />
                )}
                <div className='flex items-end gap-2'>
                  <motion.span
                    className='min-w-4 text-[16px] font-thin'
                    style={{
                      color: score.address === maskedAddress ? 'rgba(243, 131, 51, 0.64)' : 'rgba(238, 238, 238, 0.60)',
                    }}
                    animate={{
                      opacity: getPositionChange(score.address) === 'down' ? [1, 0.5, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {score.position}.
                  </motion.span>
                  <span className='font-semibold'>{`${usernamesCache?.[score.address] ?? formatAddress(score.address)} ${
                    score.address === maskedAddress ? '(you)' : ''
                  }`}</span>
                </div>
                <div className='flex items-center gap-0.5'>
                  <CoinsIcon />
                  <motion.span
                    animate={{
                      opacity: getPositionChange(score.address) === 'down' ? [1, 0.5, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {score.score}
                  </motion.span>
                </div>
              </motion.div>
            ),
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Leaderboard
