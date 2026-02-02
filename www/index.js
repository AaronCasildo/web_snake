import init, { World } from "web_snake"

init().then(() => {
    const cell_size = 30;

    const world = World.new();
    const world_width = world.width();

    const canvas = document.getElementById("snake-canvas");
    const context = canvas.getContext("2d");
    canvas.height = world_width * cell_size;
    canvas.width = world_width * cell_size;
    
    function drawGrid(){
        context.beginPath();

        // Vertical lines
        for (let x = 0 ; x<world_width+1;x++){
            context.moveTo(x*cell_size,0);
            context.lineTo(x*cell_size,world_width*cell_size);
        }

        // Horizontal lines
        for (let y = 0 ; y<world_width+1;y++){
            context.moveTo(0, y*cell_size);
            context.lineTo(world_width*cell_size, y*cell_size);
        }
        context.stroke();
    }

    function drawSnake(){

        const snake_head_index = world.snake_head();
        const col = snake_head_index % world_width;
        const row = Math.floor(snake_head_index / world_width);

        context.beginPath();
        context.fillRect(
            col * cell_size,
            row * cell_size,
            cell_size,
            cell_size
        )
        context.stroke();
    }
    drawSnake();
    drawGrid();
});