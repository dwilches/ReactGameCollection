import React, { useState } from "react";
import { Button, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useNavigate, useSearchParams } from "react-router";

const allGames = [
    { name: "Snake", url: "snake", image: "snake.png" },
    { name: "MineScooper", url: "mine-scooper", image: "mine-scooper.png" },
];

export default function GameChooser() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isShowing, setIsShowing] = useState(true);

    const currentGame = parseInt(searchParams.get("currentGame") ?? "0");

    const navigate = useNavigate();

    const showNextGame = (nextGame: number) => {
        setIsShowing(false);
        setTimeout(() => {
            const newGame = (allGames.length + currentGame + nextGame) % allGames.length;
            setSearchParams({ currentGame: newGame.toString() });
            setIsShowing(true);
        }, 500);
    };

    return (
        <div className="mt-8 flex  items-center h-screen justify-center">
            <div>
                <Button onClick={ () => showNextGame(-1) }>
                    <span>‹‹</span>
                </Button>
                <span className={ "text-4xl" }>{/* spacer for alignment */ }</span>
            </div>
            <div className="size-50 m-2">
                <Transition show={ isShowing }>
                    <div
                        className={ clsx(
                            'size-full rounded-xl bg-white/5 hover:bg-sky-800 shadow-lg transition duration-400',
                            'data-closed:scale-50 data-closed:rotate-[-120deg] data-closed:opacity-50',
                            'data-leave:duration-200 data-leave:ease-in-out',
                            'data-leave:data-closed:scale-95 data-leave:data-closed:rotate-0 p-1',
                            'flex flex-col items-center',
                        ) }
                    >
                        <img className={ "rounded-xl mb-2 cursor-pointer" }
                             src={ allGames[currentGame].image }
                             alt={ allGames[currentGame].name }
                             onClick={ () => navigate(allGames[currentGame].url) }/>

                        <h1 className={ "text-4xl" }>{ allGames[currentGame].name }</h1>
                    </div>
                </Transition>
            </div>

            <div>
                <Button onClick={ () => showNextGame(+1) }>
                    <span>››</span>
                </Button>
                <span className={ "text-4xl" }>{/* spacer for alignment */ }</span>
            </div>
        </div>
    );
}
