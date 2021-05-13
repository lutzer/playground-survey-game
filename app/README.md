# Playground Survey Game

Gamified Survey for planing the playground at Tempelhofer Feld in Berlin.

## Development

* run `npm install`
* then run `npm start` to start dev server

## Compression of Meshes

* uses https://github.com/CesiumGS/gltf-pipeline
* run `gltf-pipeline -i trees.gltf -o trees.min.gltf -d` to compress tiles. Tiles need to be exported without Compression and without UVs.


## Resources

https://lettier.github.io/3d-game-shaders-for-beginners/index.html