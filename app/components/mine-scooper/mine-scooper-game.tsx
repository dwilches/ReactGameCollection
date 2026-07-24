import styles from "./mine-scooper.module.css";
import clsx from "clsx";
import { Button } from "@headlessui/react";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { cloneDeep } from "lodash-es";

const BoardRows = 10;
const BoardCols = 10;

const MineProbability = 0.2;


interface BoardCell {
    containsMine: boolean;
    // Players can open a cell when they're sure it's safe
    revealed: boolean;
    // Players can mark a suspicious cell with a flag to avoid opening it later
    marked: boolean;
    // If the players failed and clicked a cell with a mine, it explodes and the game is over
    exploded: boolean;
    // Number of mines in adjacent cells to give the player a hint
    numNeighboringMines: number;
}

type GameBoard = BoardCell[][];

type GameOverType = "won" | "lost";

export const MineScooperGame = () => {

    const navigate = useNavigate();
    const [gameBoard, setGameBoard] = useState<GameBoard>(createGameBoard());
    const [gameOver, setGameOver] = useState<GameOverType>();

    const revealCell = useCallback((row: number, col: number) => {
        setGameBoard(gameBoard => {
            // If it's already revealed, nothing to do
            if (gameBoard[row][col].revealed) {
                return gameBoard;
            }

            const newGameBoard = cloneDeep(gameBoard);
            if (newGameBoard[row][col].containsMine) {
                newGameBoard[row][col].exploded = true;
                newGameBoard[row][col].marked = false;
                setGameOver("lost");
                return revealAllCells(newGameBoard);
            } else {
                newGameBoard[row][col].revealed = true;
                newGameBoard[row][col].marked = false;
                if (allSafeCellsRevealed(newGameBoard)) {
                    setGameOver("won");
                    return revealAllCells(newGameBoard);
                } else {
                    return newGameBoard;
                }
            }
        });
    }, []);

    const markCell = useCallback((row: number, col: number) => {
        setGameBoard(gameBoard => {
            // If it's already revealed, nothing to do
            if (gameBoard[row][col].revealed) {
                return gameBoard;
            }
            const newGameBoard = cloneDeep(gameBoard);
            newGameBoard[row][col].marked = !newGameBoard[row][col].marked;
            return newGameBoard;
        });
    }, []);

    const onCellClicked = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>, row: number, col: number) => {
        if (event.ctrlKey) {
            markCell(row, col);
        } else {
            revealCell(row, col);
        }
    }, []);

    const restartGame = () => {
        setGameBoard(createGameBoard());
        setGameOver(undefined);
    };

    return (
        <div className={ styles.gameContainer }>
            <div className={ styles.instructionsContainer }>
                <div><span className={ styles.focusedText }>Click:</span> to reveal a cell.</div>
                <div><span className={ styles.focusedText }>Ctrl+Click:</span> to mark a cell.</div>
                <div>You win once all "safe cells" are revealed.</div>
            </div>
            <div className={ styles.boardContainer }>
                {
                    gameBoard.map((row, rowIdx) => (
                        <div className={ styles.boardRow } key={ rowIdx }>
                            {
                                row.map((cell, colIdx) => (
                                    <div className={ clsx(styles.boardCell, cellStyle(cell)) }
                                         key={ colIdx }
                                         onClick={ event => onCellClicked(event, rowIdx, colIdx) }>
                                        { cell.revealed && !cell.containsMine ? cell.numNeighboringMines : "" }
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
            <div className={ styles.actionButtonsContainer }>
                <Button onClick={ () => navigate("/") }>Back to Game Selection</Button>
                {
                    gameOver && <Button onClick={ restartGame }>Restart</Button>
                }
            </div>
        </div>
    );
};

const createGameBoard = (): GameBoard => {
    const gameBoard: BoardCell[][] = new Array(BoardRows);
    for (let row = 0; row < BoardRows; row++) {
        gameBoard[row] = new Array(BoardCols);
        for (let col = 0; col < BoardCols; col++) {
            gameBoard[row][col] = {
                containsMine: Math.random() < MineProbability,
                marked: false,
                revealed: false,
                exploded: false,
                numNeighboringMines: 0, // will be updated below
            };
        }
    }

    // Now that all mines are in place, calculate how many mines are adjacent to each column.
    // This is to display a hint to the players.
    for (let row = 0; row < BoardRows; row++) {
        for (let col = 0; col < BoardCols; col++) {
            gameBoard[row][col].numNeighboringMines = countNeighboringMines(gameBoard, row, col);
        }
    }

    return gameBoard;
};

const cellStyle = (cell: BoardCell): string => {
    if (cell.marked) {
        return styles.markedCell;
    }

    if (!cell.revealed) {
        return styles.unknownCell;
    }

    if (cell.exploded) {
        return styles.explodedCell;
    }

    if (cell.containsMine) {
        return styles.mineCell;
    }

    return styles.emptyCell;
};

const revealAllCells = (gameBoard: GameBoard): GameBoard => {
    const newGameBoard = cloneDeep(gameBoard);
    newGameBoard.forEach(row => row.forEach(cell => cell.revealed = true));
    return newGameBoard;
};

const countNeighboringMines = (gameBoard: BoardCell[][], row: number, col: number): number => {
    function countMinesHelper(possibleRow: number, possibleCol: number): number {
        if (possibleRow < 0 || possibleRow >= BoardRows) return 0;
        if (possibleCol < 0 || possibleCol >= BoardCols) return 0;
        return gameBoard[possibleRow][possibleCol].containsMine ? 1 : 0;
    }

    return (
        // Right/left
        countMinesHelper(row - 1, col) +
        countMinesHelper(row + 1, col) +
        // Above/below
        countMinesHelper(row, col - 1) +
        countMinesHelper(row, col + 1) +
        // Top Diagonals
        countMinesHelper(row - 1, col - 1) +
        countMinesHelper(row - 1, col + 1) +
        // Bottom diagonals
        countMinesHelper(row + 1, col - 1) +
        countMinesHelper(row + 1, col + 1)
    );
};

const allSafeCellsRevealed = (gameBoard: BoardCell[][]): boolean => {
    for (let row = 0; row < BoardRows; row++) {
        for (let col = 0; col < BoardCols; col++) {
            if (!gameBoard[row][col].revealed && !gameBoard[row][col].containsMine) {
                return false;
            }
        }
    }
    return true;
}
