use wasm_bindgen::prelude::*;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(module = "/www/utils/random.js")]
extern {
    fn random(max: usize) -> usize;
}

#[wasm_bindgen]
#[derive(PartialEq)]
pub enum Direction{
    Up,
    Down,
    Left,
    Right
}

#[wasm_bindgen]
#[derive(Clone,Copy)]
pub enum GameState{
    Playing,
    GameOver,
    Win
}

#[derive(PartialEq,Clone,Copy)]

pub struct SnakeCell(usize);

struct Snake{
    body: Vec<SnakeCell>,
    direction: Direction,
}

impl Snake{
    fn new(spawn_index: usize, size: usize) -> Snake{

        let mut body = vec!();  

        for i in 0..size {
            body.push(SnakeCell(spawn_index - i));
        }

        Snake 
        { 
            body,
            direction: Direction::Down, // Default direction at the start
        }
    }
}

#[wasm_bindgen]
pub struct World{
    width: usize,
    snake: Snake,
    size: usize,
    next_cell: Option<SnakeCell>, // Placeholder for future use, can hold the next cell to be added
    reward_cell: usize,
    state: Option<GameState>,
}

#[wasm_bindgen]
impl World{
    pub fn new(width: usize, snake_spawn_index: usize) -> World{
        let snake = Snake::new(snake_spawn_index, 5); // Initial snake size of 5
        let size = width * width; 


        World{
            width,
            size: width * width,
            reward_cell: World::gen_reward_cell(size, &snake.body), // Placeholder for future use, can hold the index of the reward cel
            snake,
            next_cell: None,
            state: None,
        }
    }

    fn gen_reward_cell(max: usize, snake_body: &Vec<SnakeCell>) -> usize{
        let mut reward_cell;

        loop{
            reward_cell = random(max);
            if !snake_body.contains(&SnakeCell(reward_cell)){
                break;
            }
        }
        return reward_cell
    }

    pub fn width(&self) -> usize{
        self.width
    }

    pub fn reward(&self)-> usize{
        self.reward_cell
    }

    pub fn snake_head(&self) -> usize{
        self.snake.body[0].0
    }

    pub fn start_game(&mut self){
        self.state = Option::Some(GameState::Playing);
    }

    pub fn game_state(&self) -> Option<GameState>{
        self.state
    }

    pub fn change_snake_direction(&mut self, direction: Direction){
        let next_cell = self.gen_next_snake_cell(&direction);

        if self.snake.body[1].0 == next_cell.0 {
            return;
        }
        self.next_cell = Option::Some(next_cell); // Placeholder for future use
        self.snake.direction = direction;
    }

    pub fn snake_size(&self) -> usize{
        self.snake.body.len()
    }   

    // *const is a raw pointer
    pub fn snake_cells(&self) -> *const SnakeCell{
        self.snake.body.as_ptr()
    }

    // pub fn snake_cells(&self) -> &Vec<SnakeCell>{
    //     &self.snake.body
    // }

    pub fn tick(&mut self){

        match self.state{
            Some(GameState::Playing) => {
                let temp_array = self.snake.body.clone();
                let lenght = self.snake.body.len();

                // Update head position with next_cell if exists
                match self.next_cell{
                    Some(cell) => {
                        self.snake.body[0] = cell;
                        self.next_cell = None;
                    },
                    None => {
                        self.snake.body[0] = self.gen_next_snake_cell(&self.snake.direction);
                    }
                }
                
                for i in 1..lenght{
                    self.snake.body[i] = SnakeCell(temp_array[i - 1].0);
                }

                if self.reward_cell == self.snake_head(){

                    if self.snake_size()<self.size{
                        self.reward_cell = World::gen_reward_cell(self.size, &self.snake.body);
                    }
                    else{
                        self.reward_cell = 9999;
                    }
                    self.snake.body.push(SnakeCell(self.snake.body[1].0));
                    
                }
            },
            _ =>{}
        }
    }

    fn gen_next_snake_cell(&self, direction: &Direction)->SnakeCell{
        let snake_index = self.snake_head();
        let row = snake_index / self.width;

        return match direction {
            Direction::Right => {
                let treshold = (row + 1) * self.width;
                if snake_index + 1 == treshold {
                    SnakeCell(treshold - self.width)
                } else {
                    SnakeCell(snake_index + 1)
                }
            },
            Direction::Left => {
                let treshold = row * self.width;
                if snake_index == treshold {
                    SnakeCell(treshold + (self.width - 1))
                } else {
                    SnakeCell(snake_index - 1)
                }
            },
            Direction::Up => {
                let treshold = snake_index - (row * self.width);
                if snake_index == treshold {
                    SnakeCell((self.size - self.width) + treshold)
                } else {
                    SnakeCell(snake_index - self.width)
                }
            },
            Direction::Down => {
                let treshold = snake_index + ((self.width - row) * self.width);
                if snake_index + self.width == treshold {
                    SnakeCell(treshold - ((row + 1) * self.width))
                } else {
                    SnakeCell(snake_index + self.width)
                }
            },
        };
    }
}


// wasm-pack build --target web