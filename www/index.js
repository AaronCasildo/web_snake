import init, { World } from "web_snake"

init().then(() => {
    const world = World.new();
    console.log(world.width());
});