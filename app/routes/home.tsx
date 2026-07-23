import type { Route } from "./+types/home";
import WelcomeDialog from "~/dialogs/welcome-dialog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import GameChooser from "~/components/game-chooser";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "React Game Collection" },
        { name: "description", content: "Some simple games using React" },
    ];
}

const WelcomeDialogAlreadyShown = "WelcomeDialogAlreadyShown";

export default function Home() {

    // Show the welcome dialog only the first time the app is loaded.
    // Once the user closes the dialog, it won't be shown again.
    const dialogAlreadyShown = JSON.parse(localStorage.getItem(WelcomeDialogAlreadyShown) ?? "false");
    const [isOpen, setIsOpen] = useState<boolean>(!dialogAlreadyShown);

    const closeDialog = () => {
        setIsOpen(false);
        localStorage.setItem(WelcomeDialogAlreadyShown, "true");
    };

    return (<>
        { isOpen && <WelcomeDialog isOpen={ isOpen } onClose={ closeDialog }/> }
        { !isOpen && <GameChooser/> }
    </>);
}
