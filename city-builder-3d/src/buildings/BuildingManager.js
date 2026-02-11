import * as THREE from 'three';
import { BUILDING_DATA } from './BuildingData.js';
import { CONSTANTS } from '../data/Constants.js';

/**
 * Creates HIGHLY DETAILED procedural building geometries
 */
export function createBuildingGeometry(type, data, tileSize) {
  const w = data.width * tileSize * 0.85;
  const d = data.depth * tileSize * 0.85;
  const h = data.height;
  const group = new THREE.Group();

  // Helper geometry creators
  const createBox = (width, height, depth, x, y, z) => {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geo);
    mesh.position.set(x, y, z);
    return mesh;
  };

  switch (type) {
    case 'residential': {
      // Modern House with Garage and Porch
      // Main body
      group.add(createBox(w, h * 0.6, d * 0.6, 0, h * 0.3, -d * 0.15));

      // Garage side
      group.add(createBox(w * 0.5, h * 0.4, d * 0.4, w * 0.3, h * 0.2, d * 0.25));

      // Porch roof
      const porch = createBox(w * 0.4, h * 0.05, d * 0.2, -w * 0.1, h * 0.4, d * 0.2);
      group.add(porch);
      // Porch pillars
      group.add(createBox(w * 0.05, h * 0.4, w * 0.05, -w * 0.25, h * 0.2, d * 0.28));
      group.add(createBox(w * 0.05, h * 0.4, w * 0.05, 0.05, h * 0.2, d * 0.28));

      // Main Roof (Pyramid)
      const roofGeo = new THREE.ConeGeometry(w * 0.8, h * 0.4, 4);
      const roofMesh = new THREE.Mesh(roofGeo);
      roofMesh.position.set(0, h * 0.6 + h * 0.2, -d * 0.15);
      roofMesh.rotation.y = Math.PI / 4;
      group.add(roofMesh);

      // Garage Roof (Slanted)
      const garageRoof = new THREE.CylinderGeometry(w * 0.01, w * 0.4, d * 0.45, 4);
      // Simplified wedge for garage roof using Box or Cylinder tricky
      // Let's use a simple box for flat roof for now to keep it clean
      group.add(createBox(w * 0.55, h * 0.05, d * 0.45, w * 0.3, h * 0.425, d * 0.25));
      break;
    }

    case 'commercial': {
      // Skyscraper with glass aesthetic (simulated by segments)
      // Base
      group.add(createBox(w, h * 0.15, d, 0, h * 0.075, 0));

      // Tower Body with indents
      group.add(createBox(w * 0.85, h * 0.75, d * 0.85, 0, h * 0.5, 0));

      // Vertical strips (columns)
      group.add(createBox(w * 0.9, h * 0.75, d * 0.1, 0, h * 0.5, d * 0.4)); // Front
      group.add(createBox(w * 0.9, h * 0.75, d * 0.1, 0, h * 0.5, -d * 0.4)); // Back

      // Top section (Hvac/Antenna)
      group.add(createBox(w * 0.6, h * 0.1, d * 0.6, 0, h * 0.925, 0));
      group.add(createBox(w * 0.1, h * 0.2, w * 0.1, 0, h, 0)); // Antenna
      break;
    }

    case 'industrial': {
      // Large Factory with multiple smokestacks and sawtooth roof
      // Main floor
      group.add(createBox(w, h * 0.6, d, 0, h * 0.3, 0));

      // Sawtooth Roofs (3 wedges)
      for (let i = 0; i < 3; i++) {
        const wedge = new THREE.CylinderGeometry(0, w / 3.5, d, 3);
        const wedgeMesh = new THREE.Mesh(wedge);
        wedgeMesh.rotation.z = Math.PI / 2;
        wedgeMesh.rotation.x = -Math.PI / 2;
        // Position spread across width
        const xPos = -w * 0.3 + (i * w * 0.3);
        wedgeMesh.position.set(xPos, h * 0.6 + w * 0.1, 0);
        group.add(wedgeMesh);
      }

      // Smokestacks
      const stackGeo = new THREE.CylinderGeometry(w * 0.1, w * 0.15, h * 0.8, 12);
      const stack1 = new THREE.Mesh(stackGeo);
      stack1.position.set(w * 0.35, h * 0.5, d * 0.35);
      group.add(stack1);

      const stack2 = stack1.clone();
      stack2.position.set(w * 0.35, h * 0.5, -d * 0.35);
      group.add(stack2);

      // Smoke puff (tiny sphere detail)
      const puff = new THREE.SphereGeometry(w * 0.12, 8, 8);
      const puffMesh = new THREE.Mesh(puff);
      puffMesh.position.set(w * 0.35, h * 0.95, d * 0.35);
      group.add(puffMesh);
      break;
    }

    case 'road': {
      // Road with curbs
      // Asphalt
      group.add(createBox(w * 1.18, h * 0.8, d * 1.18, 0, h * 0.4, 0));
      // Curbs / Sidewalk strips
      group.add(createBox(w * 1.18, h, d * 0.1, 0, h * 0.5, d * 0.45));
      group.add(createBox(w * 1.18, h, d * 0.1, 0, h * 0.5, -d * 0.45));
      break;
    }

    case 'avenue': {
      // Wider road with median
      group.add(createBox(w * 1.18, 0.2, d * 1.18, 0, 0.1, 0));
      // Median strip
      group.add(createBox(w * 1.18, 0.25, d * 0.1, 0, 0.125, 0));
      // Trees on median (simple cones)
      const tree = new THREE.ConeGeometry(0.3, 0.8, 6);
      const t1 = new THREE.Mesh(tree); t1.position.set(-1, 0.5, 0); group.add(t1);
      const t2 = new THREE.Mesh(tree); t2.position.set(1, 0.5, 0); group.add(t2);
      break;
    }

    case 'power_plant': {
      // Nuclear Style Plant
      // Reactor Dome
      const domeGeo = new THREE.SphereGeometry(w * 0.4, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const dome = new THREE.Mesh(domeGeo);
      dome.position.set(-w * 0.2, h * 0.4, 0);
      group.add(dome);

      // Main building block
      group.add(createBox(w * 0.5, h * 0.4, d, w * 0.25, h * 0.2, 0));

      // Cooling Towers
      const towerGeo = new THREE.CylinderGeometry(w * 0.15, w * 0.25, h * 0.8, 16, 1, true);
      const t1 = new THREE.Mesh(towerGeo); t1.position.set(0, h * 0.4, -d * 0.3); group.add(t1);
      const t2 = new THREE.Mesh(towerGeo); t2.position.set(0, h * 0.4, d * 0.3); group.add(t2);
      break;
    }

    case 'water_tower': {
      // Classic Water Tower on lattice
      // Legs (Lattice approximation with cylinders)
      const legGeo = new THREE.CylinderGeometry(0.1, 0.1, h * 0.7, 4);
      const l1 = new THREE.Mesh(legGeo); l1.position.set(-w * 0.3, h * 0.35, -d * 0.3); l1.rotation.z = 0.1; group.add(l1);
      const l2 = new THREE.Mesh(legGeo); l2.position.set(w * 0.3, h * 0.35, -d * 0.3); l2.rotation.z = -0.1; group.add(l2);
      const l3 = new THREE.Mesh(legGeo); l3.position.set(-w * 0.3, h * 0.35, d * 0.3); l3.rotation.x = -0.1; group.add(l3);
      const l4 = new THREE.Mesh(legGeo); l4.position.set(w * 0.3, h * 0.35, d * 0.3); l4.rotation.x = 0.1; group.add(l4);

      // Tank
      const tankGeo = new THREE.CylinderGeometry(w * 0.4, w * 0.4, h * 0.3, 16);
      const tank = new THREE.Mesh(tankGeo);
      tank.position.set(0, h * 0.8, 0);
      group.add(tank);

      // Top Conical Roof
      const cap = new THREE.Mesh(new THREE.ConeGeometry(w * 0.42, h * 0.15, 16));
      cap.position.set(0, h * 0.95 + 0.1, 0);
      group.add(cap);
      break;
    }

    case 'police': {
      // Police Station - Blue theme accents
      group.add(createBox(w, h * 0.5, d * 0.8, 0, h * 0.25, 0)); // Main floor

      // Entrance portico
      group.add(createBox(w * 0.3, h * 0.4, d * 0.2, 0, h * 0.2, d * 0.45));

      // Helipad on roof
      group.add(createBox(w * 0.7, h * 0.05, d * 0.6, 0, h * 0.525, 0));
      const H = createBox(w * 0.4, h * 0.02, w * 0.1, 0, h * 0.56, 0); // part of H
      group.add(H);

      // Siren lights detail
      const sirenL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5));
      sirenL.position.set(-w * 0.4, h * 0.6, d * 0.4);
      group.add(sirenL);
      break;
    }

    case 'hospital': {
      // Hospital - Complex with wings
      // Central Hub
      group.add(createBox(w * 0.4, h * 0.9, d * 0.4, 0, h * 0.45, 0));

      // Wing 1
      group.add(createBox(w * 0.9, h * 0.5, d * 0.3, 0, h * 0.25, 0));
      // Wing 2
      group.add(createBox(w * 0.3, h * 0.5, d * 0.9, 0, h * 0.25, 0));

      // Red Cross (protruding)
      const c1 = createBox(w * 0.25, h * 0.1, 0.5, 0, h * 0.7, d * 0.21);
      group.add(c1);
      const c2 = createBox(w * 0.08, h * 0.25, 0.5, 0, h * 0.7, d * 0.21);
      group.add(c2);
      break;
    }

    case 'school': {
      // U-shaped building + playground
      // Main block back
      group.add(createBox(w, h * 0.5, d * 0.3, 0, h * 0.25, -d * 0.3));
      // Side wing L
      group.add(createBox(w * 0.25, h * 0.5, d * 0.8, -w * 0.375, h * 0.25, 0));
      // Side wing R
      group.add(createBox(w * 0.25, h * 0.5, d * 0.8, w * 0.375, h * 0.25, 0));

      // Clock tower in center back
      group.add(createBox(w * 0.2, h * 0.4, d * 0.2, 0, h * 0.7, -d * 0.3));

      // Triangle Roof on clock tower
      const roof = new THREE.Mesh(new THREE.ConeGeometry(w * 0.15, h * 0.2, 4));
      roof.position.set(0, h * 0.9 + 0.1, -d * 0.3);
      roof.rotation.y = Math.PI / 4;
      group.add(roof);
      break;
    }

    case 'waste': {
      // Industry style with pipes
      group.add(createBox(w, h * 0.4, d, 0, h * 0.2, 0));
      // Big Incinerator stack
      const stack = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.2, w * 0.3, h * 0.8, 12));
      stack.position.set(-w * 0.2, h * 0.4, -d * 0.2);
      group.add(stack);
      // Garbage mound
      const mound = new THREE.Mesh(new THREE.SphereGeometry(w * 0.3, 8, 8, 0, Math.PI, 0, Math.PI / 2));
      mound.position.set(w * 0.2, h * 0.4, d * 0.2);
      mound.scale.y = 0.5;
      group.add(mound);
      break;
    }

    default: {
      const box = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(box);
      mesh.position.y = h / 2;
      group.add(mesh);
    }
  }

  return mergeGroupToGeometry(group);
}

/**
 * Merge a group of meshes into a single BufferGeometry for instancing
 */
function mergeGroupToGeometry(group) {
  let totalVerts = 0;
  let totalIdx = 0;

  group.children.forEach(child => {
    child.updateMatrix();
    totalVerts += child.geometry.attributes.position.count;
    totalIdx += child.geometry.index ? child.geometry.index.count : child.geometry.attributes.position.count;
  });

  const positions = new Float32Array(totalVerts * 3);
  const normals = new Float32Array(totalVerts * 3);
  const indices = [];
  let vertOffset = 0;

  group.children.forEach(child => {
    const geo = child.geometry;
    const pos = geo.attributes.position;
    const norm = geo.attributes.normal;
    const matrix = child.matrix;

    const tempVec = new THREE.Vector3();
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix);

    for (let i = 0; i < pos.count; i++) {
      tempVec.fromBufferAttribute(pos, i);
      tempVec.applyMatrix4(matrix);
      positions[(vertOffset + i) * 3] = tempVec.x;
      positions[(vertOffset + i) * 3 + 1] = tempVec.y;
      positions[(vertOffset + i) * 3 + 2] = tempVec.z;

      if (norm) {
        tempVec.fromBufferAttribute(norm, i);
        tempVec.applyMatrix3(normalMatrix).normalize();
        normals[(vertOffset + i) * 3] = tempVec.x;
        normals[(vertOffset + i) * 3 + 1] = tempVec.y;
        normals[(vertOffset + i) * 3 + 2] = tempVec.z;
      }
    }

    if (geo.index) {
      for (let i = 0; i < geo.index.count; i++) {
        indices.push(geo.index.array[i] + vertOffset);
      }
    } else {
      for (let i = 0; i < pos.count; i++) {
        indices.push(i + vertOffset);
      }
    }

    vertOffset += pos.count;
  });

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  merged.setIndex(indices);
  merged.computeVertexNormals();

  // Cleanup
  group.children.forEach(child => child.geometry.dispose());

  return merged;
}

export class BuildingManager {
  constructor(scene, grid, gameState) {
    this.scene = scene;
    this.grid = grid;
    this.gameState = gameState;
    this.buildings = new Map();
    this.instancedMeshes = new Map();
    this.initInstancedMeshes();
  }

  initInstancedMeshes() {
    Object.keys(BUILDING_DATA).forEach(type => {
      const data = BUILDING_DATA[type];
      const geometry = createBuildingGeometry(type, data, this.grid.tileSize);

      const color = new THREE.Color(CONSTANTS.COLORS[type]);
      const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.6,
        metalness: 0.1,
        flatShading: true
      });

      const mesh = new THREE.InstancedMesh(geometry, material, 500);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.count = 0;
      this.instancedMeshes.set(type, mesh);
      this.scene.add(mesh);
    });
  }

  createBuilding(type, gridX, gridZ) {
    const data = BUILDING_DATA[type];
    if (!data) return null;

    const mesh = this.instancedMeshes.get(type);
    const building = {
      type, gridX, gridZ,
      data: { ...data },
      instanceIndex: mesh.count,
      population: type === 'residential' ? 0 : undefined,
      workers: type === 'commercial' || type === 'industrial' ? 0 : undefined
    };

    const worldPos = this.grid.gridToWorld(gridX, gridZ);
    const matrix = new THREE.Matrix4();
    matrix.setPosition(worldPos.x, 0, worldPos.z);

    mesh.setMatrixAt(building.instanceIndex, matrix);
    mesh.instanceMatrix.needsUpdate = true;
    mesh.count++;

    for (let x = gridX; x < gridX + data.width; x++) {
      for (let z = gridZ; z < gridZ + data.depth; z++) {
        const tile = this.grid.getTile(x, z);
        if (tile) {
          tile.building = building;
          if (type === 'road' || type === 'avenue') tile.road = true;
        }
      }
    }

    this.buildings.set(`${gridX},${gridZ}`, building);
    this.gameState.addBuilding(building);
    return building;
  }

  demolishBuilding(building) {
    const data = building.data;
    const mesh = this.instancedMeshes.get(building.type);

    const lastIdx = mesh.count - 1;
    if (building.instanceIndex < lastIdx) {
      const lastMatrix = new THREE.Matrix4();
      mesh.getMatrixAt(lastIdx, lastMatrix);
      mesh.setMatrixAt(building.instanceIndex, lastMatrix);

      for (const [key, b] of this.buildings) {
        if (b.type === building.type && b.instanceIndex === lastIdx) {
          b.instanceIndex = building.instanceIndex;
          break;
        }
      }
    }
    mesh.count--;
    mesh.instanceMatrix.needsUpdate = true;

    for (let x = building.gridX; x < building.gridX + data.width; x++) {
      for (let z = building.gridZ; z < building.gridZ + data.depth; z++) {
        const tile = this.grid.getTile(x, z);
        if (tile) {
          tile.building = null;
          if (building.type === 'road' || building.type === 'avenue') tile.road = false;
        }
      }
    }
    this.buildings.delete(`${building.gridX},${building.gridZ}`);
    this.gameState.removeBuilding(building);
  }

  getBuildingConfig(type) {
    return BUILDING_DATA[type];
  }

  getAllBuildings() {
    return Array.from(this.buildings.values());
  }
}
