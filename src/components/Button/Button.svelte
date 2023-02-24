<script lang="ts">
    export let title: string
    export let onClick
    export let disabled: boolean
</script>
<style>
    button {
        align-self: center;
        border: none;
        min-width: 132px;
        border-radius: 12px;
        color: white;
        background-color: black;
        margin: 0 8px 0 8px;
        padding: 1em;
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: bold;
        cursor: pointer;
    }

    button:disabled {
        border: 2px solid #3A3A3C;
    }

    button:enabled {
        border: 2px solid #ff3e00;
    }
</style>

<button disabled={disabled} on:click={onClick}>
    {title}
</button>