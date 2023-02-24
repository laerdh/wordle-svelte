<script lang="ts">
	import { wordleStore, canSubmit, wordStore } from "./stores/WordleStore"
	import { onMount } from "svelte";
	import Row from "./components/Row/Row.svelte"
	import Button from "./components/Button/Button.svelte"
	import { GameState, MatchResult, Tile, TileRow } from "./types";
	import { TOTAL_ATTEMPTS } from "./constants/AppConstants";

	document.onkeyup = (event: KeyboardEvent) => {
		switch (event.code) {
			case 'Backspace':
				const previousSibling = event.target?.previousSibling
				previousSibling?.focus()
				break
			case 'Enter':
				if (!$canSubmit) return
				submit()
				const nextParent = event.target?.parentNode?.nextSibling?.firstChild
				console.log('PARENT NODE', nextParent)
				nextParent.focus()
				break
			default:
				var regex = new RegExp('^Key[A-Z]')
				
				const isLetter = regex.test(event.code)
				if (!isLetter) return

				const nextSibling = event.target?.nextSibling
				nextSibling?.focus()
				break
		}
	}
	
	onMount(() => {
		console.log('MUNT')
		start()
	})

	function createRows(columns: number): Array<TileRow> {
		const rows = Array()

		for (var i = 0; i < TOTAL_ATTEMPTS; i++) {
			const tiles = Array<Tile>()
			const isFirstRow = i === 0
			
			for (var j = 0; j < columns; j++) {
				tiles.push({
					index: j,
					value: '',
					matchResult: MatchResult.INITIAL,
					onInput: onInput
				})
			}
	
			rows.push({
				index: i,
				isActive: isFirstRow,
				tiles: tiles
			})
		}

		return rows
	}

	function start() {
		const currentWord = getWord()
		const rows = createRows(currentWord.length)

		wordleStore.update(store => {
			return {
				...store,
				gameState: GameState.GAME_START,
				currentWord: currentWord,
				currentRow: rows[0],
				rows: rows,
				attemptsLeft: TOTAL_ATTEMPTS
			}
		})
	}

	function getWord(): string {
		const nextWordIndex = Math.floor(Math.random() * $wordStore.size)
		let i = 0

		for (let word of $wordStore) {
			if (i === nextWordIndex) {
				return word
			}

			i++
		}
	}

	function matchCharacters(word: string, row: TileRow): Array<MatchResult> {
		const wordLowerCased = word.toLowerCase()

		const result = row.tiles.map((tile, index) => {
			const value = tile.value.toLowerCase()
			const matchesExact = wordLowerCased.charAt(index) === value
			const includesCharacter = !!value && wordLowerCased.includes(value)

			if (matchesExact) {
				return MatchResult.MATCHES_EXACT
			} else if (includesCharacter) {
				return MatchResult.MATCHES_PARTIALLY
			} else {
				return MatchResult.NO_MATCH
			}
		})

		return result
	}

	function updateResult(matchResults: Array<MatchResult>) {
		wordleStore.update(store => {
			const wordMatches = matchResults.every(result => result === MatchResult.MATCHES_EXACT)
			const attemptsLeft = --store.attemptsLeft
			const nextRow = store.rows.at(store.currentRow.index + 1)

			var updatedStore = {
				...store,
				attemptsLeft: attemptsLeft,
				currentRow: nextRow,
				rows: store.rows.map((row, index) => {
					const isActiveRow = index === store.currentRow.index
					const isNextRow = index === nextRow?.index ?? false
					
					if (isActiveRow) {
						row.tiles = row.tiles.map((tile, index) => {
							tile.matchResult = matchResults[index]
							return tile
						})
					}
					
					row.isActive = isNextRow && !wordMatches && attemptsLeft > 0

					return row
				})
			}

			if (wordMatches || attemptsLeft === 0) {
				updatedStore.gameState = wordMatches ? GameState.GAME_WON : GameState.GAME_LOST
			}

			return updatedStore
		})
	}

	function updateTile(index: number, value: string) {
		wordleStore.update(store => {
			return {
				...store,
				rows: store.rows.map(row => {
					const isCurrentRow = row.index === store.currentRow.index

					if (isCurrentRow) {
						row.tiles[index].value = value
					}

					return row
				})
			}
		})
	}

	function submit() {
		const matchResult = matchCharacters($wordleStore.currentWord, $wordleStore.currentRow)
		updateResult(matchResult)
	}

	function onInput(event: InputEvent, tile: Tile) {
		const value = event.data
		updateTile(tile.index, value)
	}
</script>

<main>
	<header class="header">
		<h1>WORDLE</h1>
		<p><b>{$wordStore.size}</b> ord på fem bokstaver</p>
	</header>
	<div class="wrapper">
		{#each $wordleStore.rows as row}
			<Row tileRow={row} />
		{/each}
	</div>
	<footer class="footer">
		{#if $wordleStore.gameState === GameState.GAME_LOST}
			<p class="game-result">Du tapte. Riktig ord var <b>{$wordleStore.currentWord.toUpperCase()}</b>.</p>
		{/if}

		{#if $wordleStore.gameState === GameState.INITIAL || $wordleStore.gameState === GameState.GAME_START }
			<Button disabled={!$canSubmit} title={'ENTER'} onClick={() => submit()} />
		{:else}
			<Button disabled={false} title={'NYTT SPILL'} onClick={start} />
		{/if}
	</footer>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		background-color: black;
	}

	:global(body) {
		height: 100%;
		width: 100%;
		color: #9d9da3;
		background-color: black;
	}

	header {
		margin: 32px 0 32px 0;
	}

	p {
		margin: 0;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
		margin: 0;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
	}

	.footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 32px 0 0 0;
	}

	.game-result {
		margin: 0 0 32px 0;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>