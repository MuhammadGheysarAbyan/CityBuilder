import * as THREE from 'three';

export class Grid {
  constructor(width, height, tileSize = 2) {
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    // Offset to center grid at world origin
    this.offsetX = -(this.width * this.tileSize) / 2;
    this.offsetZ = -(this.height * this.tileSize) / 2;
    this.tiles = this.createGrid();
    this.mesh = this.createGridMesh();
  }

  createGrid() {
    const tiles = [];
    for (let x = 0; x < this.width; x++) {
      tiles[x] = [];
      for (let z = 0; z < this.height; z++) {
        tiles[x][z] = {
          x, z,
          worldX: x * this.tileSize + this.offsetX + this.tileSize / 2,
          worldZ: z * this.tileSize + this.offsetZ + this.tileSize / 2,
          type: 'grass',
          building: null,
          road: false
        };
      }
    }
    return tiles;
  }

  createGridMesh() {
    const totalW = this.width * this.tileSize;
    const totalH = this.height * this.tileSize;
    const segW = this.width * 2;
    const segH = this.height * 2;
    const geometry = new THREE.PlaneGeometry(totalW, totalH, segW, segH);
    geometry.rotateX(-Math.PI / 2);

    const positions = geometry.attributes.position.array;
    const colors = new Float32Array(geometry.attributes.position.count * 3);

    // Add subtle terrain height variation (gentle rolling hills)
    for (let i = 0; i < positions.length; i += 3) {
      const px = positions[i];
      const pz = positions[i + 2];

      // Multi-frequency terrain variation
      const h1 = Math.sin(px * 0.04) * Math.cos(pz * 0.04) * 0.4;
      const h2 = Math.sin(px * 0.08 + 1.5) * Math.cos(pz * 0.06 + 0.7) * 0.2;
      const h3 = Math.sin(px * 0.15 + 3.0) * Math.cos(pz * 0.12 + 2.0) * 0.08;
      positions[i + 1] += h1 + h2 + h3;
    }
    geometry.computeVertexNormals();

    // Rich, natural-looking grass with more variation
    for (let i = 0; i < colors.length; i += 3) {
      const vIdx = i / 3;
      const px = positions[vIdx * 3];
      const pz = positions[vIdx * 3 + 2];

      // Position-based variation for patches look
      const dist = Math.sqrt(px * px + pz * pz) * 0.015;
      const wave = Math.sin(px * 0.12) * Math.cos(pz * 0.12) * 0.08;
      const patch = Math.sin(px * 0.3 + pz * 0.3) * 0.03;
      const noise = (Math.random() - 0.5) * 0.04;
      const variation = wave + patch + Math.sin(dist * 3.0) * 0.04 + noise;

      const brightness = 0.85 + Math.sin(dist * 5) * 0.1;

      colors[i] = (0.26 + variation) * brightness;       // R
      colors[i + 1] = (0.56 + variation + 0.06) * brightness; // G
      colors[i + 2] = (0.16 + variation * 0.4) * brightness;  // B
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.88,
      metalness: 0.0
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh;
  }

  getTile(x, z) {
    if (x < 0 || x >= this.width || z < 0 || z >= this.height) return null;
    return this.tiles[x][z];
  }

  worldToGrid(worldX, worldZ) {
    return {
      x: Math.floor((worldX - this.offsetX) / this.tileSize),
      z: Math.floor((worldZ - this.offsetZ) / this.tileSize)
    };
  }

  gridToWorld(gridX, gridZ) {
    return {
      x: gridX * this.tileSize + this.offsetX + this.tileSize / 2,
      z: gridZ * this.tileSize + this.offsetZ + this.tileSize / 2
    };
  }
}