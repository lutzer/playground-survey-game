import _ from 'lodash'
import { Subject } from 'rxjs'
import { PlaygroundSettings } from './babylon/playground'
import { TileState } from './babylon/tile'

type State = {
  tiles : TileState[]
  selectedTile : number | undefined
  version: string
}

enum Actions {
  selectTile,
  setTileType
}

class Statemachine extends Subject<State> {

  static STORAGE_KEY = 'pg-state'

  _state : State

  constructor(settings: PlaygroundSettings) {
    super()
    console.log('init statemachine')
    // set initial state
    this._state = {
      tiles: Array(settings.gridSize * settings.gridSize).fill(null).map( (v,i) => { 
        return { 
          type: 'grass', 
          rotation: <number>_.sample([Math.PI, 0, Math.PI / 2, Math.PI * 1.5]), 
          index: i 
        }
      }),
      selectedTile: undefined,
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
      console.log(data)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger(action: Actions, args: any) : void {
    if (action == Actions.selectTile) {
      this._state.selectedTile = args.id
    } else if (action == Actions.setTileType && this._state.selectedTile != undefined ) {
      this._state.tiles[this._state.selectedTile].type = args.type
    }
    this.next(this.state)
    this.save()
  }
}

export { Statemachine, Actions }
export type { State }