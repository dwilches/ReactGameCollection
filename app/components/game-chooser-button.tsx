import React from "react";
import { Button } from "@headlessui/react";
import clsx from "clsx";

interface Props {
    text: string;
    onClick: () => void;
}

export const GameChooserButton = (props: Props) => (
    <Button className={
        clsx("mt-10 flex items-center gap-2 rounded-full px-3 py-1",
            "bg-white/10  text-sm/6 font-semibold text-white transition hover:bg-sky-800",
            "data-hover:scale-105  cursor-pointer")
    }
            onClick={ props.onClick }>
        < span> { props.text }</span>
    </Button>
);
