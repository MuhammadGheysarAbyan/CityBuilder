import * as THREE from 'three';
import { Grid } from './Grid.js';
import { CONSTANTS } from '../data/Constants.js';

export class WorldManager {
  constructor(scene, gameState) {
    this.scene = scene;
    this.gameState = gameState;
    this.grid = new Grid(CONSTANTS.GRID_SIZE, CONSTANTS.GRID_SIZE, CONSTANTS.TILE_SIZE);
    this.scene.add(this.grid.mesh);

    this.trees = [];
    this.lamps = [];
    this.time = 0;

    this.createTrees();
    this.createStreetLamps();
    this.createRocks();
    this.createWaterFeature();
  }

  createTrees() {
    const gridTotal = CONSTANTS.GRID_SIZE * CONSTANTS.TILE_SIZE;
    const halfGrid = gridTotal / 2;

    // Place trees around the edges and scattered outside the grid
    const treePositions = [];
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = halfGrid * (0.85 + Math.random() * 0.5);
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      treePositions.push({ x, z });
    }
    // Sprinkle some within the grid but at corners
    for (let i = 0; i < 12; i++) {
      const corner = Math.floor(Math.random() * 4);
      const sign = [(1, 1), (-1, 1), (-1, -1), (1, -1)];
      const sx = corner < 2 ? -1 : 1;
      const sz = corner % 2 === 0 ? -1 : 1;
      treePositions.push({
        x: sx * (halfGrid * 0.7 + Math.random() * halfGrid * 0.25),
        z: sz * (halfGrid * 0.7 + Math.random() * halfGrid * 0.25)
      });
    }

    const foliageColors = [0x2E7D32, 0x388E3C, 0x43A047, 0x1B5E20, 0x4CAF50];

    treePositions.forEach(pos => {
      const group = new THREE.Group();

      // Trunk
      const trunkH = 2 + Math.random() * 2.5;
      const trunkGeo = new THREE.CylinderGeometry(0.12, 0.22, trunkH, 6);
      const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x5D4037,
        roughness: 0.9
      });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = trunkH / 2;
      trunk.castShadow = true;
      group.add(trunk);

      // Multi-layered foliage
      const layers = 2 + Math.floor(Math.random() * 2);
      for (let l = 0; l < layers; l++) {
        const fRadius = (1.8 - l * 0.35) * (0.7 + Math.random() * 0.5);
        const fHeight = 1.5 + Math.random() * 0.8;
        const fGeo = new THREE.ConeGeometry(fRadius, fHeight, 7);
        const fMat = new THREE.MeshStandardMaterial({
          color: foliageColors[Math.floor(Math.random() * foliageColors.length)],
          roughness: 0.75
        });
        const foliage = new THREE.Mesh(fGeo, fMat);
        foliage.position.y = trunkH + l * 0.9;
        foliage.castShadow = true;
        group.add(foliage);
      }

      group.position.set(pos.x, 0, pos.z);
      group.rotation.y = Math.random() * Math.PI * 2;
      const scale = 0.7 + Math.random() * 0.8;
      group.scale.set(scale, scale, scale);
      this.scene.add(group);
      this.trees.push(group);
    });
  }

  createStreetLamps() {
    const gridTotal = CONSTANTS.GRID_SIZE * CONSTANTS.TILE_SIZE;
    const halfGrid = gridTotal / 2;

    // Place lamps along grid edges
    const lampPositions = [];
    for (let i = -halfGrid + 5; i < halfGrid; i += 12) {
      lampPositions.push({ x: -halfGrid - 2, z: i });
      lampPositions.push({ x: halfGrid + 2, z: i });
      lampPositions.push({ x: i, z: -halfGrid - 2 });
      lampPositions.push({ x: i, z: halfGrid + 2 });
    }

    lampPositions.forEach(pos => {
      const group = new THREE.Group();

      // Pole
      const poleGeo = new THREE.CylinderGeometry(0.06, 0.1, 6, 6);
      const poleMat = new THREE.MeshStandardMaterial({
        color: 0x424242,
        metalness: 0.7,
        roughness: 0.3
      });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 3;
      pole.castShadow = true;
      group.add(pole);

      // Arm (horizontal piece)
      const armGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.5, 4);
      const arm = new THREE.Mesh(armGeo, poleMat);
      arm.rotation.z = Math.PI / 2;
      arm.position.set(0.75, 5.8, 0);
      group.add(arm);

      // Lamp head
      const lampGeo = new THREE.SphereGeometry(0.25, 8, 8);
      const lampMat = new THREE.MeshStandardMaterial({
        color: 0xFFF9C4,
        emissive: 0xFFE082,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9
      });
      const lamp = new THREE.Mesh(lampGeo, lampMat);
      lamp.position.set(1.5, 5.8, 0);
      group.add(lamp);

      // Point light
      const light = new THREE.PointLight(0xFFE0B2, 0.4, 15, 2);
      light.position.set(1.5, 5.8, 0);
      group.add(light);

      group.position.set(pos.x, 0, pos.z);
      // Face inward
      group.lookAt(0, 0, 0);
      group.rotation.x = 0;
      group.rotation.z = 0;

      this.scene.add(group);
      this.lamps.push({ mesh: group, lamp, light, lampMat });
    });
  }

  createRocks() {
    const gridTotal = CONSTANTS.GRID_SIZE * CONSTANTS.TILE_SIZE;
    const halfGrid = gridTotal / 2;

    for (let i = 0; i < 25; i++) {
      const rockGeo = new THREE.DodecahedronGeometry(0.3 + Math.random() * 0.5, 0);
      const shade = 0x757575 + Math.floor(Math.random() * 0x222222);
      const rockMat = new THREE.MeshStandardMaterial({
        color: shade,
        roughness: 0.92,
        metalness: 0.02
      });
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.position.set(
        (Math.random() - 0.5) * gridTotal * 1.1,
        0.15,
        (Math.random() - 0.5) * gridTotal * 1.1
      );
      rock.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
      rock.castShadow = true;
      rock.receiveShadow = true;
      this.scene.add(rock);
    }
  }

  createWaterFeature() {
    const gridTotal = CONSTANTS.GRID_SIZE * CONSTANTS.TILE_SIZE;
    const halfGrid = gridTotal / 2;

    // Small pond near edge
    const pondGeo = new THREE.CircleGeometry(8, 32);
    pondGeo.rotateX(-Math.PI / 2);
    this.pondMat = new THREE.MeshStandardMaterial({
      color: 0x1E88E5,
      roughness: 0.05,
      metalness: 0.6,
      transparent: true,
      opacity: 0.75,
      emissive: 0x0D47A1,
      emissiveIntensity: 0.15
    });
    this.pond = new THREE.Mesh(pondGeo, this.pondMat);
    this.pond.position.set(halfGrid + 10, 0.05, halfGrid + 10);
    this.pond.receiveShadow = true;
    this.scene.add(this.pond);

    // Pond edge - ring of stones
    for (let i = 0; i < 16; i++) {
      const stoneAngle = (i / 16) * Math.PI * 2;
      const stoneR = 8 + (Math.random() - 0.5) * 0.5;
      const stoneGeo = new THREE.DodecahedronGeometry(0.4 + Math.random() * 0.3, 0);
      const stoneMat = new THREE.MeshStandardMaterial({
        color: 0x9E9E9E,
        roughness: 0.9
      });
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      stone.position.set(
        halfGrid + 10 + Math.cos(stoneAngle) * stoneR,
        0.2,
        halfGrid + 10 + Math.sin(stoneAngle) * stoneR
      );
      stone.castShadow = true;
      this.scene.add(stone);
    }
  }

  update(dt) {
    this.time += dt;

    // Gentle tree sway
    this.trees.forEach((tree, idx) => {
      const sway = Math.sin(this.time * 0.8 + idx * 1.5) * 0.015;
      tree.rotation.z = sway;
      tree.rotation.x = Math.cos(this.time * 0.6 + idx) * 0.008;
    });

    // Lamp glow pulsing
    this.lamps.forEach((lampData, idx) => {
      const pulse = (Math.sin(this.time * 1.5 + idx) + 1) * 0.5;
      lampData.lampMat.emissiveIntensity = 0.5 + pulse * 0.5;
      lampData.light.intensity = 0.3 + pulse * 0.3;
    });

    // Water shimmer
    if (this.pondMat) {
      this.pondMat.emissiveIntensity = 0.1 + Math.sin(this.time * 2) * 0.08;
    }
  }
}