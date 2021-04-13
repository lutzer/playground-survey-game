import { AbstractAssetTask, AssetsManager, ContainerAssetTask, Scene, TextureAssetTask } from '@babylonjs/core'

//standard exchangable tiles
type StandardTileTypes = 'grass'|'tree'|'swings'|'trampolin'|'slide'|'sandbox'

//tiles for plansche
type WaterbodyPoolTiles = 'pool1'|'pool2'|'pool3'|'pool4'|'pool5'|'pool6'|'pool7'|'pool8'|'pool9'

type TileType = StandardTileTypes | WaterbodyPoolTiles

function onTaskCompleted<Type>(task: AbstractAssetTask) : Promise<Type> {
  return new Promise((resolve) => {
    task.onSuccess = (task) => resolve(task)
  })
}

const loadAssets = function(scene : Scene, callback : (tasks : AbstractAssetTask[]) => void) : void {
  const assetsManager = new AssetsManager(scene)

  Promise.all([
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'tree', 'assets/meshes/' ,'tile_tree.gltf')), 
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'grass', 'assets/meshes/' ,'tile_grass.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'trampolin', 'assets/meshes/' ,'tile_trampolin.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'swings', 'assets/meshes/' ,'tile_swings.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'slide', 'assets/meshes/' ,'tile_slide.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'sandbox', 'assets/meshes/' ,'tile_sandbox.gltf')),

    // Load pool tiles
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool1', 'assets/meshes/pool/' ,'R1.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool2', 'assets/meshes/pool/' ,'R2.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool3', 'assets/meshes/pool/' ,'R3.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool4', 'assets/meshes/pool/' ,'M1.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool5', 'assets/meshes/pool/' ,'M2.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool6', 'assets/meshes/pool/' ,'M3.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool7', 'assets/meshes/pool/' ,'L1.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool8', 'assets/meshes/pool/' ,'L2.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', 'pool9', 'assets/meshes/pool/' ,'L3.gltf')),

    // load textures
    onTaskCompleted<AbstractAssetTask>(assetsManager.addTextureTask('texture-fountain','assets/textures/flare.png'))
  ]).then((tasks) => {
    callback(tasks)
  })

  assetsManager.load()
}

export { loadAssets }
export type { TileType }

