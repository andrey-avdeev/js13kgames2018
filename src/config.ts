export class Config {
  public static WORLD_FRICTION_FACTOR: number = 0.5;
  public static WORLD_GRAVITY_FACTOR: number = 0.5;

  public static PLAYER_HORIZONTAL_SPEED: number = 4;
  public static PLAYER_JUMP_SPEED: number = 16;
  public static PLAYER_BASE_WIDTH: number = 32;
  public static PLAYER_BASE_HEIGHT: number = 32;

  public static PLATFORM_LIVE_GAP: 2;
  public static PLATFORM_BASE_WIDTH: number = 50;
  public static PLATFORM_BASE_HEIGHT: number = 16;
  public static PLATFORM_POOL_MAX_SIZE: number = 50;
  public static PLATFORM_AFTERJUMP_SPEED:number = 13;
}

export default Config;