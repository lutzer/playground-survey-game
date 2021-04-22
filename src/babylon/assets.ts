import { AbstractAssetTask, AssetsManager, Scene } from '@babylonjs/core'

//standard exchangable tiles
type StandardTileTypes = 'grass'|'tree'|'swings'|'trampolin'|'slide'|'sandbox'|'house'|'boulders'

//tiles for plansche
type WaterbodyTiles = 'pool1'|'pool2'|'pool3'|'pool4'|'pool5'|'pool6'|'pool7'|'pool8'|'pool9'|'pool'

type TileType = StandardTileTypes | WaterbodyTiles

function onTaskCompleted<Type>(task: AbstractAssetTask) : Promise<Type> {
  return new Promise((resolve) => {
    task.onSuccess = (task) => resolve(task)
  })
}

const loadAssets = function(scene : Scene, callback : (tasks : AbstractAssetTask[]) => void) : void {
  const assetsManager = new AssetsManager(scene)

  Promise.all([
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'tree', 'assets/meshes/' ,'tile_trees.min.gltf')), 
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'grass', 'assets/meshes/' ,'tile_grass.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'trampolin', 'assets/meshes/' ,'tile_trampolin.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'swings', 'assets/meshes/' ,'tile_swings.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'slide', 'assets/meshes/' ,'tile_slide.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'sandbox', 'assets/meshes/' ,'tile_sandbox.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'house', 'assets/meshes/' ,'tile_house.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'boulders', 'assets/meshes/' ,'tile_boulders.min.gltf')),

    // Load pool tiles
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool1', 'assets/meshes/pool/' ,'L1.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool2', 'assets/meshes/pool/' ,'M1.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool3', 'assets/meshes/pool/' ,'R1.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool4', 'assets/meshes/pool/' ,'L2.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool5', 'assets/meshes/pool/' ,'M2.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool6', 'assets/meshes/pool/' ,'R2.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool7', 'assets/meshes/pool/' ,'L3.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool8', 'assets/meshes/pool/' ,'M3.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool9', 'assets/meshes/pool/' ,'R3.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool', 'assets/meshes/pool/' ,'tile_pool.min.gltf')),

    // load textures
    onTaskCompleted<AbstractAssetTask>(assetsManager.addTextureTask('texture-fountain','assets/textures/flare.png'))
  ]).then((tasks) => {
    callback(tasks)
  })

  assetsManager.load()
}

export { loadAssets }
export type { TileType }

