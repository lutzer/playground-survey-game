import { AssetsManager, ContainerAssetTask, Scene } from '@babylonjs/core'

const loadAssets = function(scene : Scene, callback : (task : ContainerAssetTask) => void) : void {
  const assetsManager = new AssetsManager(scene)

  
  const task1 = assetsManager.addContainerTask('task1', '', 'assets/meshes/' ,'tile_tree.gltf')
  task1.onSuccess = (task) => {
    // console.log(task)
    callback(task)
  }

  // const task2 = assetsManager.addContainerTask('task1', '', 'assets/meshes/' ,'tile_grass.gltf')
  // task2.onSuccess = (task) => {
  //   // console.log(task)
  //   callback(task)
  // }
  
  // assetsManager.onTaskSuccessObservable.add( function(task) {
  //   callback(task)
  // })

  assetsManager.load()
}

export { loadAssets }

