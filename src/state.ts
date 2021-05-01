import _ from 'lodash'
import { Subject } from 'rxjs'
import { SelectableTiles } from './babylon/assets'
import { PlaygroundSettings } from './babylon/playground'
import { TileState } from './babylon/tiles'

type Avatar = 'flower-girl'|'explorer'|'social'
type PlayGroundType = 'pool'|'river'

type State = {
  tiles : TileState[]
  selectedTile?: number
  avatar?: Avatar
  playgroundType: PlayGroundType
  missing? : string
  version: string
}

enum Actions {
  selectTile,
  setTileType,
  setAvatar,
  setPlaygroundType,
  setMissingText
}

function  calculateNumberOfSelectedTiles(state: State) : number {
  // console.log('tile', Object.values(SelectableTiles))
  const selectedTiles = state.tiles.filter((t) => {
    return t.type != SelectableTiles.grass && Object.keys(SelectableTiles).includes(t.type)
  }).length
  return selectedTiles
}

class Statemachine extends Subject<State> {

  static STORAGE_KEY = 'pg-state'

  private _state : State

  constructor(settings: PlaygroundSettings) {
    super()
    // set initial state
    this._state = {
      tiles: Array(settings.gridSize * settings.gridSize).fill(null).map( (v,i) => { 
        return { 
          type: SelectableTiles.grass, 
          rotation: <number>_.sample([Math.PI, 0, Math.PI / 2, Math.PI * 1.5]), 
          index: i
        }
      }),
      playgroundType: 'pool',
      version: settings.version
    }
    // load state from storage
    this.load()
    this.next(this.state)
  }

  load() : void {
    const storage = window.localStorage
    const item = storage.getItem(Statemachine.STORAGE_KEY) || ''
    try {
      const data = JSON.parse(item)
      // only use data if the version is same
      if (data.version == this._state.version)
        this._state = { ...this._state, ...data,}
    } catch (err) {
      console.warn('could not load data from storage')
    }
  }

  save() : void {
    const storage = window.localStorage
    storage.setItem(Statemachine.STORAGE_KEY, JSON.stringify(this._state))
  }

  get state() : State {
    return _.cloneDeep(this._state) 
  }

  trigger(action: Actions, args: any) : void {
    if (action == Actions.selectTile) {
      this._state.selectedTile = args.id
    } else if (action == Actions.setTileType && this._state.selectedTile != undefined ) {
      this._state.tiles[this._state.selectedTile].type = args.type
    } else if (action == Actions.setAvatar && args.avatar ) {
      this._state.avatar = args.avatar
    } else if (action == Actions.setPlaygroundType && args.type ) {
      this._state.playgroundType = args.type
    } else if (action == Actions.setMissingText && args.text ) {
      this._state.missing = args.text
    }
    this.next(this.state)
    this.save()
  }
}

export { Statemachine, Actions, calculateNumberOfSelectedTiles }
export type { State, PlayGroundType, Avatar }