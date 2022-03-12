export interface AppState {
    state: GameState
    word: string
    rows: Array<TileRow>
    currentTileIndex: number
    currentRowIndex: number
    remainingAttempts: number
    canGuess: boolean
}

export enum TileState {
    INITIAL,
    WRONG,
    INCLUDES,
    CORRECT
}

export enum GameState {
    INITIAL,
    STARTED,
    FINISHED
}

export interface Tile {
    rowIndex: number
    tileIndex: number
    value: string
    state: TileState
    onInput: (event: Event, tile: Tile) => void
}

export interface TileRow {
    tiles: Array<Tile>
    disabled: boolean
}