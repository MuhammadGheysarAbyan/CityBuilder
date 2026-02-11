import { Grid } from './Grid.js';
import { CONSTANTS } from '../data/Constants.js';
export class WorldManager {
  constructor(scene, gameState) {
    this.scene = scene; this.gameState = gameState;
    this.grid = new Grid(CONSTANTS.GRID_SIZE, CONSTANTS.GRID_SIZE, CONSTANTS.TILE_SIZE);
    this.scene.add(this.grid.mesh);
  }
}