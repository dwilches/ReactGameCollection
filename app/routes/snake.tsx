import { SnakeGame } from "~/components/snake-game/snake-game";
import type { Route } from "../../.react-router/types/app/routes/+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Snake - React Game Collection" },
        { name: "description", content: "Traditional snake game" },
    ];
}

export default function SnakePage() {
    return (
        <div className="mt-8 flex  items-center h-screen justify-center">
            <SnakeGame/>
        </div>
    );
}
