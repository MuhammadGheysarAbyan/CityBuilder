/**
 * Engine.js - Main Game Engine
 * Coordinates all game systems and manages game loop
 */

import { SceneManager } from './SceneManager.js';
import { InputManager } from './InputManager.js';
import { TimeManager } from './TimeManager.js';
import { WorldManager } from '../world/WorldManager.js';
import { BuildingManager } from '../buildings/BuildingManager.js';
import { PlacementSystem } from '../buildings/PlacementSystem.js';
import { SimulationManager } from '../simulation/SimulationManager.js';
import { UIManager } from '../ui/UIManager.js';
import { GameState } from '../data/GameState.js';

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;

    // Initialize core systems
    this.gameState = new GameState();
    this.sceneManager = new SceneManager(canvas);
    this.inputManager = new InputManager(canvas, this.sceneManager.camera);
    this.timeManager = new TimeManager();

    // Initialize world
    this.worldManager = new WorldManager(this.sceneManager.scene, this.gameState);

    // Initialize building system
    this.buildingManager = new BuildingManager(
      this.sceneManager.scene,
      this.worldManager.grid,
      this.gameState
    );

    this.placementSystem = new PlacementSystem(
      this.worldManager.grid,
      this.buildingManager,
      this.sceneManager.scene,
      this.gameState
    );

    // Initialize simulation
    this.simulationManager = new SimulationManager(
      this.gameState,
      this.worldManager,
      this.buildingManager
    );

    // Initialize UI
    this.uiManager = new UIManager(
      this.gameState,
      this.timeManager,
      this.placementSystem,
      this.buildingManager,
      this.worldManager,
      this.sceneManager
    );

    // Game loop state
    this.lastTime = performance.now();
    this.simulationAccumulator = 0;
    this.isRunning = false;

    // Connect systems
    this.connectSystems();
  }

  connectSystems() {
    // Connect input to placement
    this.inputManager.on('click', (data) => {
      if (this.placementSystem.isPlacing) {
        this.placementSystem.confirmPlacement();
      } else {
        this.handleBuildingClick(data);
      }
    });

    this.inputManager.on('rightclick', () => {
      if (this.placementSystem.isPlacing) {
        this.placementSystem.cancelPlacement();
      }
    });

    this.inputManager.on('mousemove', (data) => {
      if (this.placementSystem.isPlacing) {
        this.placementSystem.updatePreview(data.raycaster, data.mouse);
      }
    });

    // Connect UI events
    this.uiManager.on('buildingSelected', (buildingType) => {
      this.placementSystem.startPlacement(buildingType);
    });

    this.uiManager.on('demolish', (building) => {
      this.buildingManager.demolishBuilding(building);
    });
  }

  handleBuildingClick(data) {
    const gridPos = this.worldManager.grid.worldToGrid(data.point.x, data.point.z);
    const tile = this.worldManager.grid.getTile(gridPos.x, gridPos.z);

    if (tile && tile.building) {
      this.uiManager.showBuildingInfo(tile.building);
    } else {
      this.uiManager.hideBuildingInfo();
    }
  }

  start() {
    this.isRunning = true;
    this.gameLoop();
    console.log('🎮 Game engine started!');
  }

  stop() {
    this.isRunning = false;
  }

  gameLoop = () => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Update time manager
    this.timeManager.update(deltaTime);

    // SIMULATION TICK (fixed timestep based on time speed)
    this.simulationAccumulator += deltaTime * this.timeManager.timeScale;

    while (this.simulationAccumulator >= this.timeManager.TICK_INTERVAL) {
      if (!this.timeManager.isPaused) {
        this.simulationTick(this.timeManager.TICK_INTERVAL / 1000);
      }
      this.simulationAccumulator -= this.timeManager.TICK_INTERVAL;
    }

    // RENDER FRAME (every frame)
    this.renderFrame(deltaTime / 1000);

    requestAnimationFrame(this.gameLoop);
  }

  simulationTick(dt) {
    // Run simulation updates
    this.simulationManager.update(dt);
  }

  renderFrame(dt) {
    // Update input
    this.inputManager.update();

    // Update scene (includes day/night cycle)
    this.sceneManager.update(dt);

    // Update world (animated trees, lamps, water)
    this.worldManager.update(dt);

    // Update UI
    this.uiManager.update(dt);

    // Render scene
    this.sceneManager.render();
  }

  onWindowResize() {
    this.sceneManager.onWindowResize();
  }
}
