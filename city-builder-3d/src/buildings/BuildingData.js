import { CONSTANTS } from '../data/Constants.js';

export const BUILDING_DATA = {
  residential: { width: 1, depth: 1, height: 8, cost: 100, maintenance: 5, capacity: 10, requiresRoad: true },
  commercial: { width: 1, depth: 1, height: 12, cost: 200, maintenance: 10, jobs: 15, requiresRoad: true },
  industrial: { width: 2, depth: 2, height: 6, cost: 150, maintenance: 8, jobs: 20, requiresRoad: true },
  road: { width: 1, depth: 1, height: 0.2, cost: 10, maintenance: 1, requiresRoad: false },
  avenue: { width: 1, depth: 1, height: 0.25, cost: 20, maintenance: 2, requiresRoad: false },
  power_plant: { width: 3, depth: 3, height: 15, cost: 500, maintenance: 50, capacity: 200, requiresRoad: true },
  water_tower: { width: 2, depth: 2, height: 12, cost: 300, maintenance: 30, capacity: 150, requiresRoad: true },
  waste: { width: 2, depth: 2, height: 8, cost: 400, maintenance: 40, capacity: 100, requiresRoad: true },
  police: { width: 2, depth: 2, height: 10, cost: 250, maintenance: 25, coverage: 30, requiresRoad: true },
  hospital: { width: 2, depth: 2, height: 10, cost: 300, maintenance: 30, coverage: 25, requiresRoad: true },
  school: { width: 2, depth: 2, height: 8, cost: 200, maintenance: 20, coverage: 20, requiresRoad: true }
};