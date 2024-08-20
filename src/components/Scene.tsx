import { CameraControls, MapControls, OrthographicCamera, Stats } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import Chunks from './canvas/Chunks'
import { WORLD_SIZE } from '@/constants'
import { Tile } from '@/models'
import { NoToneMapping, OrthographicCamera as Camera, Vector3 } from 'three'
import { useRef, useEffect } from 'react'

interface SceneProps {
  tiles: Record<string, Tile>
  cameraTargetPosition?: [number, number]
  cameraRef?: React.RefObject<Camera>
}

const useCameraLerp = (cameraRef: React.RefObject<Camera>, targetPosition?: [number, number]) => {
  const targetRef = useRef(new Vector3(200, 200, 200))

  useEffect(() => {
    if (targetPosition) {
      targetRef.current.set(0, 50, 0)
      targetRef.current.x += targetPosition[0]
      targetRef.current.z += targetPosition[1]
    }
  }, [targetPosition])

  useFrame(() => {
    if (!cameraRef.current) return

    cameraRef.current.position.lerp(targetRef.current, 0.05)
  })
}

const Scene = ({ tiles, cameraTargetPosition, cameraRef = useRef<Camera>(null) }: SceneProps) => {
  useCameraLerp(cameraRef, cameraTargetPosition)

  return (
    <>
      <color attach='background' args={['#9c9c9c']} />
      <ambientLight />
      <OrthographicCamera ref={cameraRef} makeDefault position={[200, 200, 200]} zoom={80} />
      {/* <Stats /> */}
      <Chunks entities={tiles} />
      <MapControls
        enableRotate={false}
        minZoom={50}
        maxZoom={200}
        maxPolarAngle={Math.PI / 2.5}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        minDistance={10}
        maxDistance={WORLD_SIZE}
      />
    </>
  )
}

export default Scene
