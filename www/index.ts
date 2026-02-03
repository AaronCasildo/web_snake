import init, { World } from "web_snake"

// Initialize the WASM module and start the game
init().then(() => {
    // Configuration
    const cell_size = 30; // Size of each grid cell in pixels
    const worldWidth = 10; // Number of cells in each row/column
    
    const snake_spawn_index = Math.floor(Math.random() * (worldWidth * worldWidth)); // Initial position of the snake head (randomized)

    // Create the game world and get its dimensions
    const world = World.new(worldWidth, snake_spawn_index);
    const world_width = world.width();

    // Setup canvas to match world dimensions
    const canvas = <HTMLCanvasElement>document.getElementById("snake-canvas");
    const context = canvas.getContext("2d");
    canvas.height = world_width * cell_size;
    canvas.width = world_width * cell_size;
    
    // Draw the grid lines (vertical and horizontal)
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

    // Render the snake on the canvas
    function drawSnake(){
        // Get snake head position and convert to row/column coordinates
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
// Draw the complete game state (snake + grid)
    function drawWorld(){
        drawSnake();
        drawGrid();
    }

    // Game loop: update world state and redraw every 100ms

    function tick(){
        const fps = 25
        setTimeout(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawWorld();
        world.tick();
        // callback to tick
        requestAnimationFrame(tick);
    }, 1000 / fps);
    }
    
    drawWorld();
    tick();
    
});