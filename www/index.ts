import init, { World, Direction, GameState } from "../pkg";
import { random } from "./utils/random";

// Initialize the WASM module and start the game
init().then((wasm: any) => {
    // Configuration
    const worldWidth = 8; // Number of cells in each row/column
    
    // Calculate responsive cell size based on window dimensions
    const maxCanvasWidth = Math.min(window.innerWidth * 0.9, 600);
    const maxCanvasHeight = Math.min(window.innerHeight * 0.7, 600);
    const cell_size = Math.floor(Math.min(maxCanvasWidth, maxCanvasHeight) / worldWidth);
    
    // Initial position of the snake head (randomized)
    const snake_spawn_index = random(worldWidth * worldWidth); 
    
    // Create the game world and get its dimensions
    const world = World.new(worldWidth, snake_spawn_index);
    const world_width = world.width();

    const points = document.getElementById("game-points");
    const gameController = document.getElementById("game-control-btn");
    const gameStateLabel = document.getElementById("game-status");

    // Setup canvas to match world dimensions
    const canvas = <HTMLCanvasElement>document.getElementById("snake-canvas");
    const context = canvas.getContext("2d");

    // Set canvas size based on world dimensions and calculated cell size
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

    // Input queue to buffer rapid keypresses
    const inputQueue: Direction[] = [];
    const maxQueueSize = 3; // Limit queue size to prevent overfilling

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
        // Handle pause toggle and game start
        if (event.code === "Space") {
            const state = world.game_state();
            
            // Start game if not started
            if (state === undefined) {
                gameStateLabel.textContent = world.game_state_lbl();
                world.start_game();
                tick();
            }
            // Toggle pause if playing or paused
            else if (state === GameState.Playing || state === GameState.Paused) {
                world.toggle_pause();
                updateGameStateLabel();
            }            
            event.preventDefault(); // Prevent page scroll
            return;
        }
        
        let direction: Direction | null = null;
        
        switch(event.code){
            case "ArrowUp":
            case "KeyW":
                direction = Direction.Up;
                break;
            case "ArrowDown":
            case "KeyS":
                direction = Direction.Down;
                break;
            case "ArrowLeft":
            case "KeyA":
                direction = Direction.Left;
                break;
            case "ArrowRight":
            case "KeyD":
                direction = Direction.Right;
                break;
        }
        
        // Add to queue if valid direction and queue not full
        if (direction !== null && inputQueue.length < maxQueueSize) {
            inputQueue.push(direction);
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

        snakeCells
        .slice()
        .reverse()
        .forEach((cellIndex,index) => {
            const col = cellIndex % world_width;
            const row = Math.floor(cellIndex / world_width);
            
            // Differentiate head from body
            context.fillStyle = index === snakeCells.length - 1 ? "blue" : "lightgreen"; 

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
        points.textContent = world.points().toString();
    }

// Draw the complete game state (snake + grid)
    function drawWorld(){
        drawSnake();
        drawGrid();
        rewardCell();
        updateGameStateLabel();
    }

    // Game loop: separate rendering from game logic updates
    // Render frequently for responsive visuals, but update game logic at controlled rate

    let lastUpdateTime = 0;
    const gameUpdateRate = 5; // Snake movement speed (moves per second)
    const updateDelay = 1000 / gameUpdateRate;

    function tick(currentTime: number = 0){
        const state = world.game_state();
        if (state == GameState.GameOver || state == GameState.Win){
            updateGameStateLabel();
            gameController.textContent = "Restart";
            return;
        }

        const deltaTime = currentTime - lastUpdateTime;

        // Update game logic (snake movement) at controlled rate
        if (deltaTime >= updateDelay) {
            lastUpdateTime = currentTime;
            
            // Process one input from the queue each tick
            if (inputQueue.length > 0) {
                const direction = inputQueue.shift()!;
                world.change_snake_direction(direction);
            }
            
            world.tick();
        }

        // Render every frame
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawWorld();
        
        requestAnimationFrame(tick);
    }
    
    drawWorld();    
});