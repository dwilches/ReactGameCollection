import { MineScooperGame } from "~/components/mine-scooper/mine-scooper-game";
import type { Route } from "../../.react-router/types/app/routes/+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Mine Scooper - React Game Collection" },
        { name: "description", content: "Like Mine Sweeper but for dog owners" },
        { tagName: "link", rel: "preload", as: "image", href: "icons/mine-scooper/poop.png" },
        { tagName: "link", rel: "preload", as: "image", href: "icons/mine-scooper/flag.png" },
        { tagName: "link", rel: "preload", as: "image", href: "icons/mine-scooper/paint.png" },
    ];
}

export default function MineScooper() {
    return (
        <div className="mt-8 flex  items-center h-screen justify-center">
            <MineScooperGame/>
        </div>
    );
}
