import { writable, derived, readable } from "svelte/store";
import { TOTAL_ATTEMPTS } from "../constants/AppConstants";
import { GameState, TileRow } from "../types";
import wordList from "../words.json"

export const wordStore = readable<Set<string>>(new Set<string>(wordList))

export const wordleStore = writable({
    gameState: GameState.INITIAL,
    currentWord: '',
    currentWordIndex: 0,
    currentRow: undefined,
    rows: Array<TileRow>(),
    attemptsLeft: TOTAL_ATTEMPTS
})

export const canSubmit = derived(
    [wordleStore, wordStore],
    ([$store, $wordStore]) => {
        if ($store.currentRow === undefined) {
            return false
        }
        console.log('Store, Current Row, Words', $store, $store.currentRow, $wordStore)

        let currentWord = $store?.currentWord
        let inputWord = $store.currentRow?.tiles?.map(tile => tile.value)?.reduce((a, b) => a + b)

        if (inputWord?.length < currentWord?.length) {
            return false
        }

        let isValidWord = $wordStore.has(inputWord)
        return isValidWord && inputWord.length === currentWord.length
    }
)
