import { Color4 } from '@babylonjs/core'
import { Camera } from '@babylonjs/core/Cameras/camera'
import { Engine } from '@babylonjs/core/Engines/engine'
import { Effect } from '@babylonjs/core/Materials/effect'
import { PostProcess } from '@babylonjs/core/PostProcesses/postProcess'
import { DefaultRenderingPipeline } from '@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline'
import { Scene } from '@babylonjs/core/scene'

const applyPostProccessing = function(scene: Scene, engine: Engine, camera: Camera) : void {
  // Create a standard pipeline
  const pipeline = new DefaultRenderingPipeline('defaultPipeline', undefined, scene, [camera])
  pipeline.imageProcessingEnabled = true
  pipeline.imageProcessing.contrast = 0.8
  pipeline.imageProcessing.exposure = 1.2
  
  pipeline.bloomEnabled = true
  pipeline.bloomThreshold = 0.2

  pipeline.imageProcessing.vignetteEnabled = true
  pipeline.imageProcessing.vignetteWeight = 10
  pipeline.imageProcessing.vignetteColor = new Color4(0,0,0,0.5)

  scene.postProcessRenderPipelineManager.addPipeline(pipeline)

  // const startTime = Date.now()
  // const pixelateShader = new PostProcess('pixelate','./shaders/pixelate', ['time'], null, 1.0, camera)
  // pixelateShader.onBeforeRender = function (effect : Effect) {
  //   const time = Date.now() - startTime 
  //   effect.setFloat('time', time)
  // }

  // const crtShader = new PostProcess('crt', './shaders/crt', ['curvature', 'screenResolution', 'scanLineOpacity', 'vignetteOpacity', 'brightness', 'vignetteRoundness'], null, 0.5, camera)
  // crtShader.onApply = function (effect : Effect) {
  //   effect.setFloat2('curvature', 3.0, 3.0)
  //   effect.setFloat2('screenResolution', 1000, 1000)
  //   effect.setFloat2('scanLineOpacity', 1, 1)
  //   effect.setFloat('vignetteOpacity', 1)
  //   effect.setFloat('brightness', 4)
  //   effect.setFloat('vignetteRoundness', 2.0)
  // }

  // const posterizeShader = new PostProcess('kuwahara','./shaders/kuwahara', ['radius'], null, 1.0, camera)
  // posterizeShader.onApply = function (effect : Effect) {
  //   effect.setInt('radius', 2)
  // }
}

export { applyPostProccessing }