import { DepthOfFieldEffectBlurLevel, Vector2 } from '@babylonjs/core'
import { Camera } from '@babylonjs/core/Cameras/camera'
import { Engine } from '@babylonjs/core/Engines/engine'
import { Color4 } from '@babylonjs/core/Maths/math'
import { BlackAndWhitePostProcess } from '@babylonjs/core/PostProcesses/blackAndWhitePostProcess'
import { BlurPostProcess } from '@babylonjs/core/PostProcesses/blurPostProcess'
import { PostProcess } from '@babylonjs/core/PostProcesses/postProcess'
import { DefaultRenderingPipeline } from '@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline'
import { PostProcessRenderEffect } from '@babylonjs/core/PostProcesses/RenderPipeline/postProcessRenderEffect'
import { PostProcessRenderPipeline } from '@babylonjs/core/PostProcesses/RenderPipeline/postProcessRenderPipeline'
import { Scene } from '@babylonjs/core/scene'

const applyPixelShader = function(scene: Scene, engine: Engine, camera: Camera) : PostProcess {
  // Create a standard pipeline
  const pipeline = new DefaultRenderingPipeline('defaultPipeline', undefined, scene, [camera])
  pipeline.imageProcessingEnabled = true
  pipeline.imageProcessing.contrast = 0.8
  pipeline.imageProcessing.exposure = 1.0
  // pipeline.bloomEnabled = true
 
  // pipeline.grainEnabled = true
  // pipeline.grain.animated = true
  // pipeline.grain.adaptScaleToCurrentViewport = true
  // pipeline.grain.intensity = 10


  // pipeline.imageProcessingEnabled = true
  // pipeline.imageProcessing.contrast = 2
  // pipeline.imageProcessing.exposure = 1.2

  // pipeline.depthOfFieldEnabled = true
  // pipeline.depthOfField.focusDistance = 4000
  // pipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Low

  pipeline.imageProcessing.vignetteEnabled = true
  pipeline.imageProcessing.vignetteWeight = 10
  pipeline.imageProcessing.vignetteColor = new Color4(0,0,0,0.5)

  // pipeline.samples = 2

  // pipeline.glowLayerEnabled = true
  // if (pipeline.glowLayer) {
  //   pipeline.glowLayer.blurKernelSize = 16 // 16 by default
  //   pipeline.glowLayer.intensity = 1 // 1 by default
  // }
  

  // pipeline.chromaticAberrationEnabled = true
  // // Create post processes
  // const blackAndWhite = new BlackAndWhitePostProcess('bw', 1.0, camera, undefined, engine, false)
  // const horizontalBlur = new BlurPostProcess('hb', new Vector2(1.0, 0), 20, 1.0, null, undefined, engine, false)

  // // Create effect with multiple post processes and add to pipeline
  // const blackAndWhiteThenBlur = new PostProcessRenderEffect(engine, 'blackAndWhiteThenBlur', function() { return [blackAndWhite, horizontalBlur] })
  // standardPipeline.addEffect(blackAndWhiteThenBlur)

  // // Add pipeline to the scene's manager and attach to the camera
  // scene.postProcessRenderPipelineManager.addPipeline(standardPipeline)
  // scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline('standardPipeline', camera)
  scene.postProcessRenderPipelineManager.addPipeline(pipeline)

  const startTime = Date.now()
  const shader = new PostProcess('pixelate','./shaders/pixelate', ['time'], null, 1.0, camera)
  shader.onBeforeRender = function (effect) {
    const time = Date.now() - startTime 
    effect.setFloat('time', time)
  }
  return shader
}

export { applyPixelShader }