export interface ThemeDefinition {
  id: string;
  name: string;
  owner: string;
  description: string;
  roomCount: number;
}

export interface DoorDefinition {
  id: string;
  themeId: string;
  number: number;
  name: string;
  roomId: string;
  puzzleId: string;
  prerequisiteDoorId?: string;
}

export interface RoomDefinition {
  id: string;
  doorId: string;
  sceneAsset?: string;
  puzzleId: string;
}

export type PuzzleState = 'initialized' | 'inProgress' | 'completed' | 'failed';

export interface PuzzleDefinition {
  id: string;
  type: string;
  instructions: string;
}
