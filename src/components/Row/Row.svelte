<script lang="ts">
    import type { TileRow } from "../../types";
    import TextInput from "../TextInput/TextInput.svelte"

    export let tileRow: TileRow
</script>

<style>
    div {
        display: inline-flex;
        flex-grow: 1;
        justify-content: center;
    }

</style>

<div>
    { #each tileRow.tiles as tile}
    <TextInput disabled={tileRow.disabled} {tile} />
    { /each}
</div>