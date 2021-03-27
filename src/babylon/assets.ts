import { AssetsManager, ContainerAssetTask, Scene } from '@babylonjs/core'

function onTaskCompleted(task: ContainerAssetTask) : Promise<ContainerAssetTask> {
  return new Promise((resolve) => {
    task.onSuccess = (task) => resolve(task)
  })
}

const loadAssets = function(scene : Scene, callback : (tasks : ContainerAssetTask[]) => void) : void {
  const assetsManager = new AssetsManager(scene)

  Promise.all([
    onTaskCompleted(assetsManager.addContainerTask('task1', 'tree', 'assets/meshes/' ,'tile_tree.gltf')), 
    onTaskCompleted(assetsManager.addContainerTask('task2', 'grass', 'assets/meshes/' ,'tile_grass.gltf')),
    onTaskCompleted(assetsManager.addContainerTask('task3', 'trampolin', 'assets/meshes/' ,'tile_trampolin.gltf')),
    onTaskCompleted(assetsManager.addContainerTask('task4', 'swings', 'assets/meshes/' ,'tile_swings.gltf'))
  ]).then((tasks) => {
    callback(tasks)
  })

  assetsManager.load()
}

export { loadAssets }

