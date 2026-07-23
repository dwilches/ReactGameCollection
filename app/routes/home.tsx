import type { Route } from "./+types/home";
import WelcomeDialog from "~/dialogs/welcome-dialog";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "React Game Collection" },
        { name: "description", content: "Some simple games using React" },
    ];
}

const WelcomeDialogAlreadyShown = "WelcomeDialogAlreadyShown";

export default function Home() {

    const dialogAlreadyShown = JSON.parse(localStorage.getItem(WelcomeDialogAlreadyShown) ?? "false");
    const [isOpen, setIsOpen] = useState<boolean>(!dialogAlreadyShown);

    const closeDialog = () => {
        setIsOpen(false);
        localStorage.setItem(WelcomeDialogAlreadyShown, "true");
    };

    return (<>
        <WelcomeDialog isOpen={ isOpen } onClose={ closeDialog }/>
    </>);
}
