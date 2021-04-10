import { AssetsManager, ContainerAssetTask, Scene } from '@babylonjs/core'

//standard exchangable tiles
type StandardTileTypes = 'grass'|'tree'|'swings'|'trampolin'|'slide'

//tiles for plansche
type WaterbodyPoolTiles = 'pool1'|'pool2'|'pool3'|'pool4'|'pool5'|'pool6'|'pool7'|'pool8'|'pool9'

type TileType = StandardTileTypes | WaterbodyPoolTiles

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
    onTaskCompleted(assetsManager.addContainerTask('task4', 'swings', 'assets/meshes/' ,'tile_swings.gltf')),
    onTaskCompleted(assetsManager.addContainerTask('task5', 'slide', 'assets/meshes/' ,'tile_slide.gltf')),

    // Load pool tiles
    onTaskCompleted(assetsManager.addContainerTask('task6', 'pool1', 'assets/meshes/pool/' ,'R1.gltf')),
    onTaskCompleted(assetsManager.addContainerTask('task6', 'pool2', 'assets/meshes/pool/' ,'R2.gltf')),
    onTaskCompleted(assetsManager.addContainerTask('task6', 'pool3', 'assets/meshes/pool/' ,'R3.gltf')),
    onTaskCompleted(assetsManager.addContainerTask('task6', 'pool4', 'assets/meshes/pool/' ,'M1.gltf')),
    onTaskCompleted(assetsManager.addContainerTask('task6', 'pool5', 'assets/meshes/pool/' ,'M2.gltf')),
    onTaskCompleted(assetsManager.addContainerTask('task6', 'pool6', 'assets/meshes/pool/' ,'M3.gltf')),
    onTaskCompleted(assetsManager.addContainerTask('task6', 'pool7', 'assets/meshes/pool/' ,'L1.gltf')),
    onTaskCompleted(assetsManager.addContainerTask('task6', 'pool8', 'assets/meshes/pool/' ,'L2.gltf')),
    onTaskCompleted(assetsManager.addContainerTask('task6', 'pool9', 'assets/meshes/pool/' ,'L3.gltf'))
  ]).then((tasks) => {
    callback(tasks)
  })

  assetsManager.load()
}

export { loadAssets }
export type { TileType }

