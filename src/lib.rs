use wasm_bindgen::prelude::*;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

struct SnakeCell(usize);

struct Snake{
    body: Vec<SnakeCell>
}

impl Snake{
    fn new(spawn_index: usize) -> Snake{
        Snake 
        { 
            body: vec!(SnakeCell(spawn_index)) 
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
        self.snake.body[0].0 = (snake_index + 1) % self.size;
    }
}


// wasm-pack build --target web