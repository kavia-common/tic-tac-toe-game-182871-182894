<template>
  <div class="min-h-screen app-bg">
    <div class="container">
      <header class="header">
        <h1 class="title">Tic Tac Toe</h1>
        <p class="subtitle">Two Player • Local</p>
      </header>

      <section class="panel">
        <div class="score">
          <div class="score-card">
            <span class="label" aria-hidden="true">X Wins</span>
            <span class="value text-primary">
              <span class="icon" role="img" aria-label="Knight wins" title="Knight wins">♞</span>
              <span class="score-number" aria-label="Knight wins count">{{ scoreX }}</span>
            </span>
          </div>
          <div class="score-card">
            <span class="label" aria-hidden="true">O Wins</span>
            <span class="value text-amber">
              <span class="icon" role="img" aria-label="Queen wins" title="Queen wins">♛</span>
              <span class="score-number" aria-label="Queen wins count">{{ scoreO }}</span>
            </span>
          </div>
          <div class="score-card">
            <span class="label">Draws</span>
            <span class="value text-gray">{{ scoreDraws }}</span>
          </div>
        </div>

        <div class="status">
          <template v-if="!gameOver">
            <span class="status-label">Turn</span>
            <span
              class="status-player"
              :class="currentPlayer === 'X' ? 'text-primary' : 'text-amber'"
              aria-live="polite"
            >
              <span
                class="icon"
                role="img"
                :aria-label="currentPlayer === 'X' ? 'Knight turn' : 'Queen turn'"
                :title="currentPlayer === 'X' ? 'Knight turn' : 'Queen turn'"
              >
                {{ pieceFor(currentPlayer) }}
              </span>
            </span>
          </template>

          <template v-else>
            <span class="status-label">Result</span>
            <span
              v-if="winner"
              class="status-player"
              :class="winner === 'X' ? 'text-primary' : 'text-amber'"
              aria-live="polite"
            >
              <span
                class="icon"
                role="img"
                :aria-label="winner === 'X' ? 'Knight wins' : 'Queen wins'"
                :title="winner === 'X' ? 'Knight wins' : 'Queen wins'"
              >
                {{ pieceFor(winner) }}
              </span>
              <span class="visually-hidden"> wins!</span>
              <span aria-hidden="true"> wins!</span>
            </span>
            <span v-else class="status-player text-gray" aria-live="polite">Draw</span>
          </template>
        </div>
      </section>

      <main class="board-wrapper">
        <div
          class="board"
          role="grid"
          aria-label="Tic Tac Toe board"
        >
          <button
            v-for="(cell, idx) in board"
            :key="idx"
            class="cell"
            :class="cellClass(idx)"
            role="gridcell"
            :aria-label="cellAriaLabel(idx)"
            :disabled="cell !== null || gameOver"
            @click="onCellClick(idx)"
          >
            <span class="cell-content" :class="{ 'fade-in': cell }">
              <span
                v-if="cell"
                class="icon"
                role="img"
                :aria-label="cell === 'X' ? 'Knight' : 'Queen'"
                :title="cell === 'X' ? 'Knight' : 'Queen'"
              >
                {{ pieceFor(cell) }}
              </span>
            </span>
          </button>
        </div>
      </main>

      <section class="controls">
        <button class="btn btn-primary" @click="newGame" aria-label="Start a new game">
          New Game
        </button>
        <button class="btn btn-outline" @click="resetScores" aria-label="Reset scores and board">
          Reset Scores
        </button>
      </section>

      <footer class="footer">
        <p class="footnote">
          Ocean Professional Theme • Smooth interactions • Accessible controls
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTicTacToe } from '~/composables/useTicTacToe'

const {
  board,
  currentPlayer,
  winner,
  isDraw,
  gameOver,
  scoreX,
  scoreO,
  scoreDraws,
  makeMove,
  newGame,
  resetScores,
  isCellInWinningLine,
  cellAriaLabel,
  lastMoveIndex,
} = useTicTacToe()

function onCellClick(index: number) {
  makeMove(index)
}

function cellClass(index: number) {
  const val = board.value[index]
  return {
    'is-x': val === 'X',
    'is-o': val === 'O',
    'is-winning': isCellInWinningLine(index),
    'is-last-move': lastMoveIndex.value === index && !isCellInWinningLine(index),
  }
}

// PUBLIC_INTERFACE
function pieceFor(player: 'X' | 'O'): string {
  /** Returns the chess icon for a given player: Knight for X, Queen for O. */
  return player === 'X' ? '♞' : '♛'
}
</script>

<style scoped>
/* Theme Colors */
:root {
  --color-primary: #2563EB;   /* Blue */
  --color-amber:   #F59E0B;   /* Amber */
  --color-error:   #EF4444;   /* Red */
  --bg:            #f9fafb;   /* Light background */
  --surface:       #ffffff;   /* Card surface */
  --text:          #111827;   /* Dark text */
  --muted:         #6b7280;   /* Gray-500 */
  --ring:          rgba(37, 99, 235, 0.25);
}

/* Utility for screen-reader-only content */
.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

/* Layout */
.app-bg {
  background: linear-gradient(180deg, rgba(37,99,235,0.06), rgba(249,250,251,1));
  min-height: 100vh;
}

.container {
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  max-width: 1024px;
  color: var(--text);
}

.header {
  text-align: center;
  margin-bottom: 1.25rem;
}

.title {
  font-size: clamp(1.5rem, 2.2vw, 2.25rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
  margin: 0;
}

.subtitle {
  color: var(--muted);
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
}

/* Panel */
.panel {
  background: var(--surface);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(17, 24, 39, 0.08);
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
  margin: 0 auto 1.25rem;
  max-width: 680px;
  border: 1px solid rgba(17, 24, 39, 0.06);
}

.score {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.score-card {
  background: #f9fafb;
  border-radius: 10px;
  padding: 0.6rem 0.8rem;
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  border: 1px solid rgba(17, 24, 39, 0.06);
}

.label {
  color: var(--muted);
  font-size: 0.85rem;
}

.value {
  font-size: 1.1rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

/* Chess icon styling for consistent sizing */
.icon {
  font-size: 1.2em; /* slightly larger than surrounding text for emphasis */
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.score-number {
  font-variant-numeric: tabular-nums;
}

.text-primary { color: var(--color-primary); }
.text-amber { color: var(--color-amber); }
.text-gray { color: #4b5563; }

.status {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(180deg, rgba(37,99,235,0.08), rgba(255,255,255,1));
  border: 1px solid rgba(37, 99, 235, 0.2);
  color: var(--text);
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
}

.status-label {
  font-size: 0.85rem;
  color: var(--muted);
}
.status-player {
  font-weight: 800;
}

/* Board */
.board-wrapper {
  display: grid;
  place-items: center;
  margin: 0 auto;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(10px, 1.2vw, 14px);
  width: min(92vw, 520px);
  aspect-ratio: 1/1;
  padding: clamp(8px, 1vw, 12px);
  background: var(--surface);
  border-radius: 18px;
  border: 1px solid rgba(17, 24, 39, 0.06);
  box-shadow: 0 16px 40px rgba(17, 24, 39, 0.08);
}

.cell {
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #f3f4f6;
  border: 1px solid rgba(17, 24, 39, 0.06);
  color: var(--text);
  font-weight: 800;
  font-size: clamp(2.2rem, 9vw, 4rem);
  transition: transform 120ms ease, background-color 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
  cursor: pointer;
  user-select: none;
  position: relative;
  outline: none;
}

.cell:hover:not(:disabled) {
  transform: translateY(-2px);
  background: #eef2ff;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.12);
  border-color: rgba(37, 99, 235, 0.35);
}

.cell:active:not(:disabled) {
  transform: translateY(0);
}

.cell:disabled {
  cursor: default;
}

.cell.is-x {
  background: linear-gradient(180deg, rgba(37,99,235,0.12), rgba(243,244,246,1));
  border-color: rgba(37, 99, 235, 0.35);
}

.cell.is-o {
  background: linear-gradient(180deg, rgba(245,158,11,0.12), rgba(243,244,246,1));
  border-color: rgba(245, 158, 11, 0.35);
}

.cell.is-winning {
  background: linear-gradient(180deg, rgba(37,99,235,0.18), rgba(245,158,11,0.18));
  box-shadow: 0 12px 26px rgba(37, 99, 235, 0.18), inset 0 0 0 1px rgba(17, 24, 39, 0.06);
  border-color: rgba(37, 99, 235, 0.45);
}

.cell.is-last-move::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 14px;
  box-shadow: inset 0 0 0 2px rgba(37,99,235,0.35);
  pointer-events: none;
}

.cell-content {
  transform: translateY(2px);
}
.cell-content.fade-in {
  animation: fade 150ms ease-out;
}

@keyframes fade {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(2px); }
}

/* Controls */
.controls {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin: 1.25rem auto 0.75rem;
}

.btn {
  border-radius: 12px;
  padding: 0.65rem 1rem;
  font-weight: 700;
  border: 1px solid transparent;
  transition: transform 120ms ease, box-shadow 180ms ease, background-color 160ms ease, border-color 160ms ease, color 160ms ease;
  cursor: pointer;
  letter-spacing: 0.01em;
}

.btn:active {
  transform: translateY(1px);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.25);
}
.btn-primary:hover {
  box-shadow: 0 14px 28px rgba(37, 99, 235, 0.3);
}

.btn-outline {
  background: transparent;
  color: var(--text);
  border: 1px solid rgba(17, 24, 39, 0.15);
}
.btn-outline:hover {
  border-color: rgba(37, 99, 235, 0.35);
  color: var(--color-primary);
}

/* Footer */
.footer {
  text-align: center;
  margin-top: 0.5rem;
}
.footnote {
  color: var(--muted);
  font-size: 0.85rem;
}

/* Responsive tweaks */
@media (max-width: 480px) {
  .panel {
    grid-template-columns: 1fr;
  }
  .status {
    justify-self: start;
  }
}
</style>
