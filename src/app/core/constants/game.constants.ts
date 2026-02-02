//Kích thước board
export const ROWS = 20;
export const COLS = 10;

//Kích thước block
export const BLOCK_SIZE = 30;

//canvas size
export const CANVAS_WIDTH = COLS * BLOCK_SIZE;
export const CANVAS_HEIGHT = ROWS * BLOCK_SIZE;

//Tốc độ rơi
export const DROP_INTERVAL = 500;

//Vị trí spawn block
export const SPAWN_X = Math.floor(COLS / 2) - 1;
export const SPAWN_Y = 0;

//Cell value
export const EMPTY_CELL = 0;
export const FILLED_CELL = 1;

//Input key
export const KEY_LEFT = 'ArrowLeft';
export const KEY_RIGHT = 'ArrowRight';
export const KEY_DOWN = 'ArrowDown';
export const KEY_ROTATE = 'ArrowUp';
export const KEY_DROP = 'Space';
