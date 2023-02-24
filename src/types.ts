export enum MatchResult {
    INITIAL,
    MATCHES_EXACT,
    MATCHES_PARTIALLY,
    NO_MATCH
}

export enum GameState {
    INITIAL,
    GAME_START,
    GAME_LOST,
    GAME_WON
}

export interface Tile {
    index: number
    value: string
    matchResult: MatchResult
    onInput: (event: Event, tile: Tile) => void
}

export interface TileRow {
    index: number
    isActive: boolean
    tiles: Array<Tile>
}