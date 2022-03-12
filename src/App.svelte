<script lang="ts">
	import Row from "./components/Row/Row.svelte"
	import Button from "./components/Button/Button.svelte"
	import { AppState, GameState, Tile, TileRow, TileState } from "./types";
	import { afterUpdate, onMount } from "svelte";

	const attempts = 6

	let appState: AppState = {
		state: GameState.INITIAL,
		word: '',
		rows: [],
		currentTileIndex: 0,
		currentRowIndex: 0,
		remainingAttempts: attempts,
		canGuess: false
	}
	
	onMount(() => {
		console.log('MOUNTED')
		start()
	})

	afterUpdate(() => {
		focusNext(appState.currentRowIndex, appState.currentTileIndex)
	})

	function start() {
		const word = 'PØLSE'
		const rows = Array<TileRow>()

		for (var i = 0; i < attempts; i++) {
			const tiles = Array<Tile>()
			
			for (var j = 0; j < word.length; j++) {
				const tile = {
					rowIndex: i,
					tileIndex: j,
					value: '',
					state: TileState.INITIAL,
					onInput: onInput
				}
	
				tiles.push(tile)
			}
	
			const row = {
				tiles: tiles,
				disabled: i !== 0
			}
	
			rows.push(row)
		}

		appState = {
			...appState,
			state: GameState.INITIAL,
			rows: rows,
			word: word,
			currentRowIndex: 0,
			currentTileIndex: 0,
			remainingAttempts: attempts,
			canGuess: false
		}
	}

	function checkWord() {
		const currentRow = appState.rows[appState.currentRowIndex]

		let exactMatches = 0

		for (var i = 0; i < currentRow.tiles.length; i++) {
			const tile = currentRow.tiles[i]
			const value = tile.value.toUpperCase()
			
			const exactMatch = appState.word.charAt(i) === value
			const includesLetter = !!value && appState.word.includes(value)

			if (exactMatch) {
				exactMatches++
				currentRow.tiles[i].state = TileState.CORRECT
			} else if (includesLetter) {
				currentRow.tiles[i].state = TileState.INCLUDES
			} else {
				currentRow.tiles[i].state = TileState.WRONG
			}
		}
		
		appState = {
			...appState,
			rows: [...appState.rows.slice(0, appState.currentRowIndex), currentRow, ...appState.rows.slice(appState.currentRowIndex + 1)],
			currentTileIndex: 0,
			currentRowIndex: ++appState.currentRowIndex,
			remainingAttempts: --appState.remainingAttempts
		}

		const hasRemainingAttempts = appState.remainingAttempts > 0
		const didGuessCorrect = appState.word.length === exactMatches

		if (didGuessCorrect || !hasRemainingAttempts) {
			finish()
		} else {
			nextRow()
		}
	}

	function finish() {
		appState = {
			...appState,
			state: GameState.FINISHED,
			rows: appState.rows.map(row => {
				row.disabled = true
				return row
			})
		}
	}

	function nextRow() {
		appState = {
			...appState,
			canGuess: false,
			rows: appState.rows.map((row, index) => {
				row.disabled = index !== appState.currentRowIndex
				return row
			})
		}
	}

	function onInput(event, tile) {
		const value = event.target.value
		const row = appState.rows[appState.currentRowIndex]
		const tiles = row.tiles
		
		tiles[tile.tileIndex].value = value
		
		const clearValue = value === ''
		const nextTileIndex = clearValue ? tile.tileIndex - 1 : tile.tileIndex + 1

		const canGuess = tiles.map(tile => !!tile.value).reduce((a, b) => a && b)

		appState = {
			...appState,
			rows: [ ...appState.rows.slice(0, appState.currentRowIndex), row, ...appState.rows.slice(appState.currentRowIndex + 1)],
			currentTileIndex: nextTileIndex,
			canGuess: canGuess
		}
	}

	function focusNext(rowIndex: number, tileIndex: number) {
		if (rowIndex !== appState.currentRowIndex) return
		if (tileIndex < 0 || tileIndex === appState.word.length) return

		const nextElement = document.getElementById(`input-${rowIndex}${tileIndex}`)
		
		if (nextElement) {
			nextElement.focus()
		}
	}
</script>

<main>
	<h1>WORDLE</h1>
	<p>Norske ord på fem bokstaver</p>
	<div class="wrapper">
		{#each appState.rows as _, i}
			<Row tileRow={appState.rows[i]} />
		{/each}
	</div>
	<div class="footer">
		{#if appState.state === GameState.INITIAL || appState.state === GameState.STARTED }
			<Button disabled={!appState.canGuess} title={'Gjett'} onClick={checkWord} />
		{:else}
			<Button disabled={false} title={'Start ny'} onClick={start} />
		{/if}
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
	}

	.footer {
		display: flex;
		margin: 32px;
		justify-content: center;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>