import { BaseParticleSystem, Color3, Color4, GPUParticleSystem, PointLight, Scene, Texture, Vector3 } from '@babylonjs/core'
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem'

interface PlaygroundEffect {
  dispose() : void
}

class Smoke implements PlaygroundEffect {

  particleSystem : ParticleSystem | undefined

  constructor(name: string, texture: Texture, scene: Scene) {
    if (!GPUParticleSystem.IsSupported)
      return

    this.particleSystem = new ParticleSystem(name + Math.random(), 300, scene)
  

    this.particleSystem.particleTexture = texture

    this.particleSystem.createSphereEmitter(0.1)

    this.particleSystem.color1 = new Color4(0.0, 0.0, 0.0, 1.0)
    this.particleSystem.color2 = new Color4(0.0, 0.0, 0.0, 1.0)
    this.particleSystem.colorDead = new Color4(1, 1, 1, 0.0)

    this.particleSystem.minSize = 0.05
    this.particleSystem.maxSize = 0.3

    // Life time of each particle (random between...
    this.particleSystem.minLifeTime = 0.1
    this.particleSystem.maxLifeTime = 0.5

    // Emission rate
    this.particleSystem.emitRate = 1000

    // Speed
    this.particleSystem.minEmitPower = 0.5
    this.particleSystem.maxEmitPower = 3
    this.particleSystem.updateSpeed = 0.01


    this.particleSystem.targetStopDuration = 0.1
    // this.particleSystem.disposeOnStop = true

  }

  dispose() : void {
    this.particleSystem?.dispose()
  }

  run(positon: Vector3) : void {
    if (this.particleSystem) {
      this.particleSystem.emitter = positon
      this.particleSystem.reset()
      this.particleSystem.start()
    }
  }

}

class Fountain implements PlaygroundEffect {

  // parent : Node
  particleSystem : BaseParticleSystem

  constructor(position: Vector3, texture: Texture, scene: Scene) {
    
    const isGpuSystem = GPUParticleSystem.IsSupported

    if (isGpuSystem) {
      const gpuSystem = new GPUParticleSystem('particles', { capacity: 500 }, scene)
      gpuSystem.activeParticleCount = 1000
      gpuSystem.start()
      this.particleSystem = gpuSystem
    } else {
      const cpuSystem = new ParticleSystem('fountain', 300, scene)
      cpuSystem.start()
      this.particleSystem = cpuSystem
    }

    this.particleSystem.particleTexture = texture

    this.particleSystem.emitter = position
    this.particleSystem.createPointEmitter(new Vector3(-1, 10, -1), new Vector3(1, 10, 1))

    this.particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0)
    this.particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0)
    this.particleSystem.colorDead = new Color4(1, 1, 1, 0.0)

    this.particleSystem.minSize = 0.01
    this.particleSystem.maxSize = isGpuSystem ? 0.1 : 0.2

    // Life time of each particle (random between...
    this.particleSystem.minLifeTime = 0.6
    this.particleSystem.maxLifeTime = 0.9

    // Emission rate
    this.particleSystem.emitRate = isGpuSystem ? 300 : 100
    this.particleSystem.gravity = new Vector3(0, -9.81, 0)

    this.particleSystem.minAngularSpeed = 0
    this.particleSystem.maxAngularSpeed = Math.PI * 0.2

    // Speed
    this.particleSystem.minEmitPower = 0.2
    this.particleSystem.maxEmitPower = 0.5
    this.particleSystem.updateSpeed = 0.005

    // Start the particle system
    // this.particleSystem.start()
  }

  dispose() : void {
    if (this.particleSystem instanceof ParticleSystem || this.particleSystem instanceof GPUParticleSystem)
      this.particleSystem.dispose()
  }
}

class WaterLight implements PlaygroundEffect {

  light: PointLight

  constructor(position: Vector3, scene: Scene) {
    this.light = new PointLight('pointLight', position, scene)
    this.light.intensity = 5
    this.light.range = 30
    this.light.diffuse = new Color3(0,1.0,1.0)
  }

  dispose() : void {
    this.light.dispose()
  }
}

export { Fountain, WaterLight, Smoke }
export type { PlaygroundEffect }