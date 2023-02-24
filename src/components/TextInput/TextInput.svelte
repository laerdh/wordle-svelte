<script lang="ts">
    import { beforeUpdate } from "svelte";
    import { Tile, MatchResult } from "../../types";

    export let rowIndex: number
    export let tile: Tile
    export let disabled: boolean

    let tileId: string
    let tileStateClass: string = 'initial'

    beforeUpdate(() => {
        tileId = `input-${rowIndex}${tile.index}`

        switch (tile.matchResult) {
            case MatchResult.INITIAL:
                tileStateClass = 'initial'
                break
            case MatchResult.MATCHES_EXACT:
                tileStateClass = 'full-match'
                break
            case MatchResult.MATCHES_PARTIALLY:
                tileStateClass = 'partial-match'
                break
            case MatchResult.NO_MATCH:
                tileStateClass = 'no-match'
                break
        }
    })
</script>

<style>
    input {
        width: 62px;
        height: 62px;
        text-align: center;
        border: 2px solid #3A3A3C;
        background-color: black;
        color: white;
        font-size: 2em;
        font-weight: bold;
        text-transform: uppercase;
        margin: 3px;
    }

    @media (min-width: 640px) {
        input {
            max-width: 4em;
            max-height: 4em;
        }
    }

    .full-match {
        background-color: green;
        border: 2px solid green;
    }

    .partial-match {
        background-color: orange;
        border: 2px solid orange;
    }

    .no-match {
        background-color: #3A3A3C;
        border: 2px solid #3A3A3C;
    }
</style>

<input
    id={tileId}
    class={tileStateClass}
    value={tile.value}
    type="text"
    disabled={disabled}
    maxlength="1"
    on:input={(event) => tile.onInput(event, tile)} />