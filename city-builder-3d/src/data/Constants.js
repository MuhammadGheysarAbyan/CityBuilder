export const CONSTANTS = {
  GRID_SIZE: 50,
  TILE_SIZE: 2,
  CHUNK_SIZE: 16,
  COLORS: {
    residential: 0x66BB6A,
    commercial: 0x42A5F5,
    industrial: 0xFFA726,
    road: 0x546E7A,
    avenue: 0x455A64,
    power_plant: 0xFFD54F,
    water_tower: 0x29B6F6,
    waste: 0x8D6E63,
    police: 0x1E88E5,
    hospital: 0xEF5350,
    school: 0xAB47BC
  },
  // Power/water usage per building type
  POWER_USAGE: {
    residential: 5,
    commercial: 10,
    industrial: 20,
    police: 8,
    hospital: 15,
    school: 8,
    waste: 12
  },
  WATER_USAGE: {
    residential: 3,
    commercial: 8,
    industrial: 15,
    police: 5,
    hospital: 12,
    school: 5,
    waste: 10
  }
};