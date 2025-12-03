import { ref, computed } from 'vue'

/**
 * PUBLIC_INTERFACE
 * useTicTacToe
 * A composable that encapsulates Tic Tac Toe game state, logic, and score tracking.
 * - Manages a 3x3 board, current player, winner/draw detection, and turn flow
 * - Tracks scores for X, O, and Draws within the session
 * - Exposes actions for making moves, starting a new game, and resetting scores
 */
export function useTicTacToe() {
  // Board is a 9-element array with 'X' | 'O' | null
  const board = ref<Array<'X' | 'O' | null>>(Array(9).fill(null))
  const currentPlayer = ref<'X' | 'O'>('X')
  const winner = ref<'X' | 'O' | null>(null)
  const isDraw = ref<boolean>(false)
  const gameOver = computed(() => winner.value !== null || isDraw.value === true)
  const lastMoveIndex = ref<number | null>(null)

  // Basic session scoreboard
  const scoreX = ref<number>(0)
  const scoreO = ref<number>(0)
  const scoreDraws = ref<number>(0)

  // All winning line indices for a 3x3 board
  const winningLines: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ]

  const winningLine = ref<number[] | null>(null)

  // PUBLIC_INTERFACE
  function makeMove(index: number): void {
    /** Attempt to make a move at index. Ignores if cell is occupied or game is over. */
    if (gameOver.value) return
    if (index < 0 || index > 8) return
    if (board.value[index] !== null) return

    board.value[index] = currentPlayer.value
    lastMoveIndex.value = index

    const result = checkWinner()
    if (result) {
      winner.value = result.player
      winningLine.value = result.line
      if (winner.value === 'X') scoreX.value += 1
      if (winner.value === 'O') scoreO.value += 1
      return
    }

    if (board.value.every((c) => c !== null)) {
      isDraw.value = true
      scoreDraws.value += 1
      return
    }

    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
  }

  function checkWinner(): { player: 'X' | 'O'; line: number[] } | null {
    for (const line of winningLines) {
      const [a, b, c] = line
      const vA = board.value[a]
      if (vA && vA === board.value[b] && vA === board.value[c]) {
        return { player: vA, line }
      }
    }
    return null
  }

  // PUBLIC_INTERFACE
  function newGame(): void {
    /** Reset the board but keep scores. */
    board.value = Array(9).fill(null)
    currentPlayer.value = 'X'
    winner.value = null
    isDraw.value = false
    winningLine.value = null
    lastMoveIndex.value = null
  }

  // PUBLIC_INTERFACE
  function resetScores(): void {
    /** Reset everything including scores. */
    scoreX.value = 0
    scoreO.value = 0
    scoreDraws.value = 0
    newGame()
  }

  // PUBLIC_INTERFACE
  function isCellInWinningLine(index: number): boolean {
    /** Returns true if the given cell index is part of the current winning line. */
    return !!winningLine.value && winningLine.value.includes(index)
  }

  // PUBLIC_INTERFACE
  function cellAriaLabel(index: number): string {
    /**
     * Returns an accessible label for the cell indicating its coordinates, state, and if it's a winning cell.
     */
    const row = Math.floor(index / 3) + 1
    const col = (index % 3) + 1
    const val = board.value[index] ?? 'Empty'
    const winPart = isCellInWinningLine(index) ? ', part of winning line' : ''
    return `Row ${row}, Column ${col}, ${val}${winPart}`
  }

  return {
    board,
    currentPlayer,
    winner,
    isDraw,
    gameOver,
    scoreX,
    scoreO,
    scoreDraws,
    lastMoveIndex,
    makeMove,
    newGame,
    resetScores,
    isCellInWinningLine,
    cellAriaLabel,
  }
}

export type UseTicTacToe = ReturnType<typeof useTicTacToe>
