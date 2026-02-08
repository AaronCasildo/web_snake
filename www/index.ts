import init, { World, Direction } from "../pkg";
import { random } from "./utils/random";

// Initialize the WASM module and start the game
init().then((wasm: any) => {
    // Configuration
    const cell_size = 30; // Size of each grid cell in pixels
    const worldWidth = 5; // Number of cells in each row/column
    
    // Initial position of the snake head (randomized)
    const snake_spawn_index = random(worldWidth * worldWidth); 
    
    // Create the game world and get its dimensions
    const world = World.new(worldWidth, snake_spawn_index);
    const world_width = world.width();

    const gameController = document.getElementById("game-control-btn");
    const gameStateLabel = document.getElementById("game-status");

    // Setup canvas to match world dimensions
    const canvas = <HTMLCanvasElement>document.getElementById("snake-canvas");
    const context = canvas.getContext("2d");

    // Set canvas size based on world dimensions and cell size
    canvas.height = world_width * cell_size;
    canvas.width = world_width * cell_size;

    // Get snake cells pointer and length
    const snake_cells_ptr = world.snake_cells();
    const snake_len = world.snake_size();


    const snake_cells = new Uint32Array(
        wasm.memory.buffer,
        snake_cells_ptr,
        snake_len
    )

    console.log("Snake Cells:",snake_cells);

    gameController.addEventListener("click", () => {
        const state = world.game_state();

        if (state === undefined){
            gameStateLabel.textContent = world.game_state_lbl();
            world.start_game();
            tick();
        }
        else{
            location.reload();
        }
    });

    document.addEventListener("keydown", (event) => {
        switch(event.code){
            case "ArrowUp":
            case "KeyW":
                world.change_snake_direction(Direction.Up);
                break;
            case "ArrowDown":
            case "KeyS":
                world.change_snake_direction(Direction.Down);
                break;
            case "ArrowLeft":
            case "KeyA":
                world.change_snake_direction(Direction.Left);
                break;
            case "ArrowRight":
            case "KeyD":
                world.change_snake_direction(Direction.Right);
                break;
        }
    });

    function rewardCell(){

        const index = world.reward();
        const col = index % world_width;
        const row = Math.floor(index / world_width);
        
        context.beginPath();
        context.fillStyle = "red"; // Reward cell color
        context.fillRect(
            col * cell_size,
            row * cell_size,
            cell_size,
            cell_size
        );
        context.stroke();

        if (index === 9999){
            updateGameStateLabel();}
    }
    
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

        const snakeCells = new Uint32Array(
            wasm.memory.buffer,
            world.snake_cells(),
            world.snake_size()
        );

        snakeCells.forEach((cellIndex,index) => {
            const col = cellIndex % world_width;
            const row = Math.floor(cellIndex / world_width);
            
            // Differentiate head from body
            context.fillStyle = index === 0 ? "blue" : "lightgreen"; 

            context.beginPath();
            context.fillRect(
            col * cell_size,
            row * cell_size,
            cell_size,
            cell_size
        )
        });
       
        context.stroke();
    }

    function updateGameStateLabel(){
        gameStateLabel.textContent = world.game_state_lbl();
    }

// Draw the complete game state (snake + grid)
    function drawWorld(){
        drawSnake();
        drawGrid();
        rewardCell();
        updateGameStateLabel();
    }

    // Game loop: update world state and redraw every 100ms

    function tick(){
        const fps = 5;
        setTimeout(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawWorld();
        world.tick();
        // callback to tick
        requestAnimationFrame(tick);
    }, 1000 / fps);
    }
    
    drawWorld();    
});