import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/snake", "routes/snake.tsx"),
    route("/mine-scooper", "routes/mine-scooper.tsx"),
] satisfies RouteConfig;
