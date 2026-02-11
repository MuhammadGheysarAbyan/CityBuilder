import * as THREE from 'three';
import { EventEmitter } from '../utils/EventEmitter.js';
import { createBuildingGeometry } from './BuildingManager.js';

export class PlacementSystem extends EventEmitter {
  constructor(grid, buildingManager, scene, gameState) {
    super();
    this.grid = grid;
    this.buildingManager = buildingManager;
    this.scene = scene;
    this.gameState = gameState;
    this.previewMesh = null;
    this.currentBuilding = null;
    this.isPlacing = false;
    this.isValid = false;
  }

  startPlacement(buildingType) {
    const config = this.buildingManager.getBuildingConfig(buildingType);
    if (!config) return;

    if (!this.gameState.canAfford(config.cost)) {
      this.emit('showToast', { message: '💰 Not enough money!', type: 'error' });
      return;
    }

    if (this.isPlacing && this.currentBuilding === buildingType) return;

    if (this.isPlacing) {
      this.cancelPlacement();
    }

    this.currentBuilding = buildingType;
    this.isPlacing = true;
    this.createPreviewMesh(buildingType);
    this.emit('placementStarted', buildingType);
  }

  createPreviewMesh(buildingType) {
    const config = this.buildingManager.getBuildingConfig(buildingType);

    // Use the SAME procedural geometry as the real building
    const geometry = createBuildingGeometry(buildingType, config, this.grid.tileSize);

    // The createBuildingGeometry function returns merged geometry centered mostly at y=height/2 or similar logic
    // We'll trust its center for now and adjust if needed

    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.6,
      roughness: 0.3,
      emissive: 0x00ff00,
      emissiveIntensity: 0.4
    });

    this.previewMesh = new THREE.Mesh(geometry, material);
    // Since BuildingManager uses setMatrixAt with position.y = 0 (and the geometry itself has y offset baked in)
    // we should position this mesh at y=0 too
    this.previewMesh.position.y = 0;

    this.scene.add(this.previewMesh);
  }

  updatePreview(raycaster, mouse) {
    if (!this.previewMesh) return;

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, point);

    const gridPos = this.grid.worldToGrid(point.x, point.z);

    // Validate if gridPos is within bounds before converting back
    if (gridPos.x < 0 || gridPos.x >= this.grid.width || gridPos.z < 0 || gridPos.z >= this.grid.height) {
      this.isValid = false;
      this.previewMesh.visible = false;
      return;
    }
    this.previewMesh.visible = true;

    const worldPos = this.grid.gridToWorld(gridPos.x, gridPos.z);
    this.previewMesh.position.x = worldPos.x;
    this.previewMesh.position.z = worldPos.z;

    const config = this.buildingManager.getBuildingConfig(this.currentBuilding);
    this.validationReason = this.getValidationReason(gridPos.x, gridPos.z, config);
    this.isValid = (this.validationReason === null);

    if (this.isValid) {
      this.previewMesh.material.color.setHex(0x00ff00);
      this.previewMesh.material.emissive.setHex(0x00ff00);
    } else {
      this.previewMesh.material.color.setHex(0xff0000);
      this.previewMesh.material.emissive.setHex(0xff0000);
    }
  }

  getValidationReason(x, z, config) {
    // Check bounds
    if (x < 0 || x + config.width > this.grid.width || z < 0 || z + config.depth > this.grid.height) {
      return "Out of bounds";
    }

    // Check overlap
    for (let dx = 0; dx < config.width; dx++) {
      for (let dz = 0; dz < config.depth; dz++) {
        const tile = this.grid.getTile(x + dx, z + dz);
        if (!tile) return "Out of bounds";
        if (tile.building) return "Space occupied";
      }
    }

    // Check road
    if (config.requiresRoad && this.currentBuilding !== 'road' && this.currentBuilding !== 'avenue') {
      if (!this.hasRoadAccess(x, z, config.width, config.depth)) return "Needs road access";
    }
    return null;
  }

  hasRoadAccess(x, z, width, depth) {
    // Check all adjacent tiles for ANY road
    const checkTile = (tx, tz) => {
      const t = this.grid.getTile(tx, tz);
      return t && t.road;
    };

    // Left side
    for (let i = 0; i < depth; i++) if (checkTile(x - 1, z + i)) return true;
    // Right side
    for (let i = 0; i < depth; i++) if (checkTile(x + width, z + i)) return true;
    // Top side (z - 1)
    for (let i = 0; i < width; i++) if (checkTile(x + i, z - 1)) return true;
    // Bottom side (z + depth)
    for (let i = 0; i < width; i++) if (checkTile(x + i, z + depth)) return true;

    return false;
  }

  confirmPlacement() {
    if (!this.previewMesh || !this.previewMesh.visible) return false;

    if (!this.isValid) {
      if (this.validationReason) {
        this.emit('showToast', { message: `❌ ${this.validationReason}`, type: 'error' });
      }
      return false;
    }

    const point = this.previewMesh.position;
    const gridPos = this.grid.worldToGrid(point.x, point.z);
    const config = this.buildingManager.getBuildingConfig(this.currentBuilding);

    if (this.gameState.canAfford(config.cost)) {
      this.buildingManager.createBuilding(this.currentBuilding, gridPos.x, gridPos.z);
      this.gameState.updateMoney(-config.cost);
      this.emit('buildingPlaced', this.currentBuilding);

      if (!this.gameState.canAfford(config.cost)) {
        this.emit('showToast', { message: '💰 Not enough money for more!', type: 'warning' });
        this.cancelPlacement();
      }
      return true;
    }

    this.emit('showToast', { message: '💰 Not enough money!', type: 'error' });
    return false;
  }

  cancelPlacement() {
    if (this.previewMesh) {
      this.scene.remove(this.previewMesh);
      if (this.previewMesh.geometry) this.previewMesh.geometry.dispose();
      if (this.previewMesh.material) this.previewMesh.material.dispose();
      this.previewMesh = null;
    }
    this.currentBuilding = null;
    this.isPlacing = false;
    this.validationReason = null;
    this.emit('placementCancelled');
  }
}
