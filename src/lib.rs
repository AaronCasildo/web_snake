use wasm_bindgen::prelude::*;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(PartialEq)]
enum Direction{
    Up,
    Down,
    Left,
    Right
}

struct SnakeCell(usize);

struct Snake{
    body: Vec<SnakeCell>,
    direction: Direction,
}

impl Snake{
    fn new(spawn_index: usize) -> Snake{
        Snake 
        { 
            body: vec!(SnakeCell(spawn_index)),
            direction: Direction::Down,
        }
    }
}

#[wasm_bindgen]
pub struct World{
    width: usize,
    snake: Snake,
    size: usize
}

#[wasm_bindgen]
impl World{
    pub fn new(width: usize, snake_spawn_index: usize) -> World{
        World{
            width,
            size: width * width,
            snake: Snake::new(snake_spawn_index),
        }
    }

    pub fn width(&self) -> usize{
        self.width
    }

    pub fn snake_head(&self) -> usize{
        self.snake.body[0].0
    }

    pub fn tick(&mut self){
        let snake_index = self.snake_head();
        let row = snake_index / self.width;
        let col = snake_index % self.width;

        if self.snake.direction == Direction::Right {
            let next_col = (col + 1) % self.width;
            self.snake.body[0].0 = (row * self.width) + next_col;
        }
        if self.snake.direction == Direction::Left {
            let next_col = (col - 1) % self.width;
            self.snake.body[0].0 = (row * self.width) + next_col;
        }
        if self.snake.direction == Direction::Up {
            let next_row = (row - 1) % self.width;
            self.snake.body[0].0 = (next_row * self.width) + col;
        }
        if self.snake.direction == Direction::Down {
            let next_row = (row + 1) % self.width;
            self.snake.body[0].0 = (next_row * self.width) + col;
        }
    }
}


// wasm-pack build --target web