import type { Puzzle } from './Puzzle';

export class PuzzleManager {
  private readonly puzzles = new Map<string, Puzzle>();

  register(puzzle: Puzzle) {
    this.puzzles.set(puzzle.definition.id, puzzle);
  }

  get(puzzleId: string) {
    return this.puzzles.get(puzzleId);
  }
}
