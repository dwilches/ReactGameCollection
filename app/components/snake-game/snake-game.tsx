import styles from "./snake-game.module.css";
import React, { useEffect, useEffectEvent, useState } from "react";
import clsx from "clsx";
import { Button } from "@headlessui/react";
import { useNavigate } from "react-router";
import {
    type BoardCell,
    BoardCols,
    BoardRows,
    GameClockSpeed,
    type SnakeDirection,
} from "~/components/snake-game/snake-types";
import { getRandomFruitCell, moveSnake, snakeContainsCell } from "~/components/snake-game/snake-helpers";

export const SnakeGame = () => {
    const navigate = useNavigate();

    const [snakeCells, setSnakeCells] = useState<BoardCell[]>([]);
    const [fruitCell, setFruitCell] = useState<BoardCell>();
    const [gameOver, setGameOver] = useState(false);
    const [snakeDirection, setSnakeDirection] = useState<SnakeDirection>([0, 1]);

    const rows = new Array(BoardRows).fill(0);
    const cols = new Array(BoardCols).fill(0);

    // Create the initial snake and fruit. The snake's tail is the first element, the head is the last
    useEffect(() => {
        if (!gameOver) {
            setSnakeCells([[0, 0], [0, 1], [0, 2]]);
            setFruitCell(getRandomFruitCell(snakeCells));
            setSnakeDirection([0, 1]);
        }
    }, [gameOver]);

    // Move the snake every X seconds
    const gameStep = useEffectEvent(() => {
        setSnakeCells(snakeCells => {
            const result = moveSnake(snakeDirection, snakeCells, fruitCell);
            switch (result.type) {
                case "snake-hit-wall":
                case "snake-hit-itself":
                    setGameOver(true);
                    return snakeCells; // snake is not modified
                case "snake-ate-fruit":
                    setFruitCell(getRandomFruitCell(snakeCells));
                    return result.newSnake!;
                case "snake-just-moved":
                    return result.newSnake!;
            }
        });
    });

    // When the game finishes, stop the game clock and don't restart it
    useEffect(() => {
        if (!gameOver) {
            const interval = setInterval(gameStep, GameClockSpeed);
            return () => clearInterval(interval);
        }
    }, [gameOver]);

    // React to user keyboard input
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            //@formatter:off
            switch (event.key) {
                case "ArrowDown": setSnakeDirection([1, 0]); break;
                case "ArrowUp": setSnakeDirection([-1, 0]); break;
                case "ArrowLeft": setSnakeDirection([0, -1]); break;
                case "ArrowRight":  setSnakeDirection([0, 1]); break;
                default: return;
            }
            //@formatter:on
            event.preventDefault();
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    // Paint snake and fruit cells with different colors
    const cellStyle = (row: number, col: number) => {
        if (snakeContainsCell(snakeCells, [row, col])) {
            return gameOver ? styles.deadSnakeCell : styles.aliveSnakeCell;
        }
        if (fruitCell && fruitCell[0] === row && fruitCell[1] === col) {
            return styles.fruitCell;
        }
        return "";
    };

    return (
        <div className={ styles.gameContainer }>
            <div className={ styles.boardContainer }>
                {
                    rows.map((_, row) => (
                        <div className={ styles.boardRow } key={ row }>
                            {
                                cols.map((_, col) => (
                                    <div className={ clsx(styles.boardCell, cellStyle(row, col)) } key={ col }></div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
            <div className={ styles.actionButtonsContainer }>
                <Button onClick={ () => navigate("/") }>Back to Game Selection</Button>
                {
                    gameOver && <Button onClick={ () => setGameOver(false) }>Restart</Button>
                }
            </div>
        </div>
    );
};
