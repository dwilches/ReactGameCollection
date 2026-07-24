
export const BoardRows = 15;
export const BoardCols = 20;

// The game will advance every this many milliseconds
export const GameClockSpeed = 200;

export type BoardCell = [number, number];
export type SnakeDirection = [number, number];

export type GameStepResultType = "snake-hit-itself" | "snake-hit-wall" | "snake-ate-fruit" | "snake-just-moved"

export interface GameStepResult {
    type: GameStepResultType;
    newSnake?: BoardCell[];
}
