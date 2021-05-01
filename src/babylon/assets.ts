import { AbstractAssetTask, AssetsManager, ContainerAssetTask, Scene, TextureAssetTask } from '@babylonjs/core'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { TextureArray, TileMeshArray } from './tiles'

enum SelectableTiles {
  grass = 'grass',
  tree = 'tree',
  trampolin = 'trampolin',
  slide = 'slide',
  sandbox = 'sandbox',
  house = 'house',
  boulders = 'boulders',
  swings = 'swings',
  seasaw = 'seasaw',
  carousel = 'carousel'
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

const loadAssets = async function(scene : Scene) : Promise<{ tileMeshes: TileMeshArray, textures: TextureArray}> {
  const assetsManager = new AssetsManager(scene)
  assetsManager.useDefaultLoadingScreen = false

  const tasks = await Promise.all([
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.tree, 'assets/meshes/' ,'tile_trees.min.gltf')), 
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.grass, 'assets/meshes/' ,'tile_grass.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.trampolin, 'assets/meshes/' ,'tile_trampolin.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.swings, 'assets/meshes/' ,'tile_swings.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.slide, 'assets/meshes/' ,'tile_slide.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.sandbox, 'assets/meshes/' ,'tile_sandbox.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.house, 'assets/meshes/' ,'tile_house.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.boulders, 'assets/meshes/' ,'tile_boulders.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.seasaw, 'assets/meshes/' ,'tile_seasaw.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', SelectableTiles.carousel, 'assets/meshes/' ,'tile_carousel.min.gltf')),

    // Load pool tiles
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', FixedTiles.pool, 'assets/meshes/waterbodies/' ,'tile_pool.min.gltf')),
    onTaskCompleted<AbstractAssetTask>(assetsManager.addContainerTask('tile', FixedTiles.river, 'assets/meshes/waterbodies/' ,'tile_stream.min.gltf')),

    // load textures
    onTaskCompleted<AbstractAssetTask>(assetsManager.addTextureTask('texture-fountain','assets/textures/flare.png')),

    // start asset loading
    new Promise((resolve) => { 
      assetsManager.load() 
      resolve(undefined) 
    })
  ])

  // load tile meshes
  const tileMeshes = tasks
    .filter((task) => {
      return task instanceof ContainerAssetTask && task.name.startsWith('tile')
    }).map((task) => (task as ContainerAssetTask))
    .reduce<TileMeshArray>((acc, task) => {
      // clone meshes
      const mesh = task.loadedContainer.instantiateModelsToScene((name) => name, false).rootNodes[0] as Mesh
    
      // save animations + name of targets
      const animations = task.loadedAnimationGroups.map((a) => {
        const anim = a.targetedAnimations[0]
        a.stop()
        return { anim: anim.animation, target: anim.target.name  }
      })
      // console.log(animations)
      mesh?.setEnabled(false)
      acc[task.meshesNames] = { mesh: mesh, animations: animations }
      return acc
    }, {})

  // load textures
  const textures = tasks
    .filter((task) => {
      return task instanceof TextureAssetTask
    })
    .map((task) => (task as TextureAssetTask))
    .reduce<TextureArray>((acc, task) => {
      acc[task.name] = task.texture
      return acc
    },{})

  return Promise.resolve({ tileMeshes: tileMeshes, textures: textures})
}

export { loadAssets, SelectableTiles, FixedTiles }
export type { TileType }

