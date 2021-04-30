import { AbstractAssetTask, AssetsManager, Scene } from '@babylonjs/core'

enum SelectableTiles {
  grass = 'grass',
  tree = 'tree',
  trampolin = 'trampolin',
  slide = 'slide',
  sandbox = 'sandbox',
  house = 'house',
  boulders = 'boulders',
  swings = 'swings'
}

//tiles for plansche
enum FixedTiles { 
  empty = 'empty',
  pool = 'pool',
  river = 'river'
}

type TileType = SelectableTiles | FixedTiles

function onTaskCompleted<Type>(task: AbstractAssetTask) : Promise<Type> {
  return new Promise((resolve) => {
    task.onSuccess = (task) => resolve(task)
  })
}

const loadAssets = function(scene : Scene, callback : (tasks : AbstractAssetTask[]) => void) : void {
  const assetsManager = new AssetsManager(scene)

  Promise.all([
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.tree, 'assets/meshes/' ,'tile_trees.min.gltf')), 
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.grass, 'assets/meshes/' ,'tile_grass.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.trampolin, 'assets/meshes/' ,'tile_trampolin.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.swings, 'assets/meshes/' ,'tile_swings.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.slide, 'assets/meshes/' ,'tile_slide.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.sandbox, 'assets/meshes/' ,'tile_sandbox.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.house, 'assets/meshes/' ,'tile_house.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.boulders, 'assets/meshes/' ,'tile_boulders.min.gltf')),

    // Load pool tiles
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', FixedTiles.pool, 'assets/meshes/waterbodies/' ,'tile_pool.min.gltf')),

    // load textures
    onTaskCompleted<AbstractAssetTask>(assetsManager.addTextureTask('texture-fountain','assets/textures/flare.png'))
  ]).then((tasks) => {
    callback(tasks)
  })

  assetsManager.load()
}

export { loadAssets, SelectableTiles, FixedTiles }
export type { TileType }

