import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Game Collection" },
    { name: "description", content: "Some simple games using React" },
  ];
}

export default function Home() {
  return (<>
    </>);
}
