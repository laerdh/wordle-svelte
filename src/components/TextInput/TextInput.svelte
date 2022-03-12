<script lang="ts">
    import { beforeUpdate } from "svelte";
    import { Tile, TileState } from "../../types";

    export let tile: Tile
    export let disabled: boolean

    let tileId: string
    let tileStateClass: string = 'initial'

    beforeUpdate(() => {
        tileId = `input-${tile.rowIndex}${tile.tileIndex}`

        switch (tile.state) {
            case TileState.INITIAL:
                tileStateClass = 'initial'
                break
            case TileState.CORRECT:
                tileStateClass = 'correct'
                break
            case TileState.WRONG:
                tileStateClass = 'wrong'
                break
            case TileState.INCLUDES:
                tileStateClass = 'includes'
                break
        }
    })
</script>

<style>
    input {
        max-width: 2em;
        max-height: 2em;
        text-align: center;
        background-color: lightgray;
        font-size: 1.5em;
        font-weight: bold;
        text-transform: uppercase;
        margin: 2px;
    }

    @media (min-width: 640px) {
        input {
            max-width: 4em;
            max-height: 4em;
        }
    }

    .correct {
        background-color: green;
    }

    .wrong {
        background-color: grey;
    }

    .includes {
        background-color: orange;
    }
</style>

<div>
    <input
        id={tileId}
        class={tileStateClass}
        value={tile.value}
        type="text"
        disabled={disabled}
        maxlength="1"
        on:input={(event) => tile.onInput(event, tile)} />
</div>