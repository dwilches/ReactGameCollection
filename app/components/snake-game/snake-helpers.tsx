import {
    type BoardCell, BoardCols,
    BoardRows,
    type GameStepResult,
    type SnakeDirection,
} from "~/components/snake-game/snake-types";


export function moveSnake(snakeDirection: SnakeDirection, snakeCells: BoardCell[], fruitCell?: BoardCell): GameStepResult {
    // Calculate the new head position. The head is the last segment of the snake.
    const lastCell = snakeCells.length - 1;
    const nextCell: BoardCell = [
        snakeCells[lastCell][0] + snakeDirection[0],
        snakeCells[lastCell][1] + snakeDirection[1],
    ];

    // Check if the snake hit a wall, and finish the game, return the snake unmodified
    if (nextCell[0] < 0 || nextCell[0] >= BoardRows || nextCell[1] < 0 || nextCell[1] >= BoardCols) {
        return { type: "snake-hit-wall" };
    }

    // Check if the snake hit itself, and finish the game if it happened, return the snake unmodified
    if (snakeContainsCell(snakeCells, nextCell)) {
        return { type: "snake-hit-itself" };
    }

    // Make a copy of the snake to not modify React's state directly
    const newSnake = [...snakeCells];

    // Check if the snake ate fruit, as then the snake doesn't move, it grows
    const ateFruit = fruitCell && nextCell[0] === fruitCell[0] && nextCell[1] === fruitCell[1];
    if (ateFruit) {
        newSnake.push(nextCell);
        return { type: "snake-ate-fruit", newSnake };
    }

    // Move each segment of the snake by copying each segment from the one in front
    for (let i = 0; i < lastCell; i++) {
        newSnake[i] = snakeCells[i + 1];
    }
    newSnake[lastCell] = nextCell;
    return { type: "snake-just-moved", newSnake };
}

export function snakeContainsCell(snakeCells: BoardCell[], cell: BoardCell): boolean {
    return snakeCells.findIndex(([r, c]) => r === cell[0] && c === cell[1]) !== -1;
}

// Return a random cell that is not currently occupied by the snake so that we can put a fruit there
export function getRandomFruitCell(snakeCells: BoardCell[]): BoardCell | undefined {
    // Count how many empty cells there are
    const numEmptyCells = BoardRows * BoardCols - snakeCells.length;

    // If the snake has grown to max length, don't generate a fruit (the snake will hit something in a moment and the
    // game will end)
    if (numEmptyCells === 0) {
        return undefined;
    }

    // Choose a random cell
    const chosenIdx = Math.floor(Math.random() * numEmptyCells);

    // Now look for that cell among the empty ones
    let cellIdx = 0;
    for (let row = 0; row < BoardRows; row++) {
        for (let col = 0; col < BoardCols; col++) {
            // Ignore non-empty cells
            if (snakeContainsCell(snakeCells, [row, col])) {
                continue;
            }

            cellIdx++;
            if (cellIdx === chosenIdx) {
                return [row, col];
            }
        }
    }

    throw `getRandomFruitCell: couldn't find an empty cell. cellIdx=${ cellIdx }, chosenIdx=${ chosenIdx }`;
}
