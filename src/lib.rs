use wasm_bindgen::prelude::*;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[derive(PartialEq)]
pub enum Direction{
    Up,
    Down,
    Left,
    Right
}

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
    size: usize
}

#[wasm_bindgen]
impl World{
    pub fn new(width: usize, snake_spawn_index: usize) -> World{
        World{
            width,
            size: width * width,
            snake: Snake::new(snake_spawn_index, 5),
        }
    }

    pub fn width(&self) -> usize{
        self.width
    }

    pub fn snake_head(&self) -> usize{
        self.snake.body[0].0
    }

    pub fn change_snake_direction(&mut self, direction: Direction){
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
        let next_head = self.gen_next_snake_cell();
        self.snake.body[0] = next_head;
    }

    fn gen_next_snake_cell(&self)->SnakeCell{
        let snake_index = self.snake_head();
        let row = snake_index / self.width;

        return match self.snake.direction {
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