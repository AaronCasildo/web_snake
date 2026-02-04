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
        let (row, col) = self.index_to_cell(snake_index);
        let (row, col) = match self.snake.direction {
            Direction::Right => {
                (row, (col + 1) % self.width)
            },
            Direction::Left => {
                (row, (col - 1) % self.width)
            },
            Direction::Up => {
                ((row - 1) % self.width, col)
            },
            Direction::Down => {
                ((row +1) % self.width, col)
            },
        };
        let next_idx = self.cell_to_index(row, col);
        self.set_snake_head(next_idx);
    }

    fn set_snake_head(&mut self, idx: usize) {
        self.snake.body[0].0 = idx;
    }

    fn index_to_cell(&self, idx: usize) -> (usize, usize) {
        (idx / self.width, idx % self.width)
    }

    fn cell_to_index(&self, row: usize, col: usize) -> usize {
        (row * self.width) + col
    }
}


// wasm-pack build --target web