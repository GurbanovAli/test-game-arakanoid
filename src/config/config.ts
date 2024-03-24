export const BLOCK_COLORS: { color: number; scorePoint: number }[] = [
  { color: 0x0000ff, scorePoint: 1 },
  { color: 0xff0000, scorePoint: 2 },
  { color: 0x00ff00, scorePoint: 3 },
];

export let APP_WIDTH: number;
export let APP_HEIGHT: number;
export let BLOCK_WIDTH: number;
export let BLOCK_HEIGHT: number;
export let PADDLE_WIDTH: number;
export let PADDLE_HEIGHT: number;
export let APP_COLOR: number = 0x000000;
export const ROWS: number = 5;
export const COLS: number = 8;
export const BALL_RADIUS: number = 10;
export const BALL_SPEED: number = 2;
export const BALL_COLOR: number = 0xffffff;
export const PADDLE_COLOR: number = 0x808080;

if (window.innerWidth < 600) {
  APP_WIDTH = 352;
  APP_HEIGHT = 340;
  BLOCK_WIDTH = 44;
  BLOCK_HEIGHT = 12;
  PADDLE_WIDTH = 60;
  PADDLE_HEIGHT = 12;
} else {
  APP_WIDTH = 640;
  APP_HEIGHT = 600;
  BLOCK_WIDTH = 80;
  BLOCK_HEIGHT = 20;
  PADDLE_WIDTH = 100;
  PADDLE_HEIGHT = 20;
}
