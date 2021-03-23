import { AssetContainer, AssetsManager, Scene } from '@babylonjs/core'

const loadAssets = function(scene : Scene, callback : (task : AssetContainer) => void) : void {
  const assetsManager = new AssetsManager(scene)

  
  const task1 = assetsManager.addContainerTask('task1', '', 'assets/meshes/' ,'tile_grass2.obj')
  task1.onSuccess = (task) => {
    callback(task.loadedContainer)
  }
  
  // assetsManager.onTaskSuccessObservable.add( function(task) {
  //   callback(task)
  // })

  assetsManager.load()
}

export { loadAssets }

