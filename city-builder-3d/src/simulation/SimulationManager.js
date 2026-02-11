import { CitizenSystem } from './CitizenSystem.js';
import { EconomySystem } from './EconomySystem.js';
import { CONSTANTS } from '../data/Constants.js';

export class SimulationManager {
  constructor(gameState, worldManager, buildingManager) {
    this.gameState = gameState;
    this.worldManager = worldManager;
    this.buildingManager = buildingManager;

    this.citizenSystem = new CitizenSystem(gameState);
    this.economySystem = new EconomySystem(gameState);
    this.tickCounter = 0;
  }

  update(deltaTime) {
    this.tickCounter++;

    this.economySystem.update(deltaTime, this.buildingManager.getAllBuildings());

    if (this.tickCounter % 2 === 0) {
      this.citizenSystem.update(deltaTime * 2, this.buildingManager.getAllBuildings());
    }

    this.updateCityStats();
  }

  updateCityStats() {
    const buildings = this.buildingManager.getAllBuildings();
    let totalPopulation = 0, totalJobs = 0, powerCap = 0, waterCap = 0;
    let powerUse = 0, waterUse = 0;

    buildings.forEach(b => {
      if (b.type === 'residential') totalPopulation += b.population || 0;
      if (b.type === 'commercial' || b.type === 'industrial') totalJobs += b.data.jobs || 0;
      if (b.type === 'power_plant') powerCap += b.data.capacity || 0;
      if (b.type === 'water_tower') waterCap += b.data.capacity || 0;

      // Calculate power & water usage
      if (CONSTANTS.POWER_USAGE[b.type]) powerUse += CONSTANTS.POWER_USAGE[b.type];
      if (CONSTANTS.WATER_USAGE[b.type]) waterUse += CONSTANTS.WATER_USAGE[b.type];
    });

    this.gameState.population = totalPopulation;
    this.gameState.powerCapacity = powerCap;
    this.gameState.waterCapacity = waterCap;
    this.gameState.powerUsage = powerUse;
    this.gameState.waterUsage = waterUse;
    this.gameState.employment = totalJobs > 0 ? Math.min(totalPopulation / totalJobs, 1) : 0;
  }
}
