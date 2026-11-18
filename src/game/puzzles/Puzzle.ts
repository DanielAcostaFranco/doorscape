import type { PuzzleDefinition, PuzzleState } from '@/types/game';

export interface PuzzleContext {
  state: PuzzleState;
  data: Record<string, unknown>;
}

export interface Puzzle {
  definition: PuzzleDefinition;
  initialize(): PuzzleContext;
  checkCompletion(context: PuzzleContext): boolean;
}
