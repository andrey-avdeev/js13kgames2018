export class Config {
  public static GAME_HEIGHT: number = 640;
  public static GAME_WIDTH: number = 360;
  public static GAME_EXTRA_LIVE_FACTOR: number = 100;

  public static WORLD_FRICTION_FACTOR: number = 0.5;
  public static WORLD_GRAVITY_FACTOR: number = 0.5;

  public static PLAYER_HORIZONTAL_SPEED: number = 4;
  public static PLAYER_JUMP_SPEED: number = 15;
  public static PLAYER_POSITION_REFRESH_FACTOR: number = 5;
  public static PLAYER_BASE_WIDTH: number = 26;
  public static PLAYER_BASE_HEIGHT: number = 26;
  public static PLAYER_LIVES: number = 3;

  public static PLATFORM_LIVE_GAP: 2;
  public static PLATFORM_BASE_WIDTH: number = 45;
  public static PLATFORM_BASE_HEIGHT: number = 14;
  public static PLATFORM_POOL_MAX_SIZE: number = 32;
  public static PLATFORM_AFTERJUMP_SPEED: number = 13;
  public static PLATFORM_EXPLOSION_PULSE_TIMEOUT: number = 200;

  public static ENEMY_LIVE_GAP: 2;
  public static ENEMY_BASE_WIDTH: number = 26;
  public static ENEMY_BASE_HEIGHT: number = 26;
  public static ENEMY_POOL_MAX_SIZE: number = 20;
  public static ENEMY_MIN_SPEED: number = 2
  public static ENEMY_SPEED: number = 2;
  public static ENEMY_MAX_SPEED: number = 4;
  public static ENEMY_MIN_GENERATION_TIMEOUT: number = 500;
  public static ENEMY_MAX_GENERATION_TIMEOUT: number = 1000;
}

export default Config;