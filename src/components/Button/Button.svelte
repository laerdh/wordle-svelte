<script lang="ts">
    export let title: string
    export let onClick
    export let disabled: boolean
</script>
<style>
    button {
        border: none;
        border-radius: 12px;
        color: white;
        padding: 1em;
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: bold;
        cursor: pointer;
    }

    .button-disabled {
        background-color: lightgray;
    }

    .button-enabled {
        background-color: #ff3e00;
    }
</style>

<button class={disabled ? 'button-disabled' : 'button-enabled'} disabled={disabled} on:click={onClick}>
    {title}
</button>