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
    const geometry = new THREE.PlaneGeometry(totalW, totalH, this.width * 2, this.height * 2);
    geometry.rotateX(-Math.PI / 2);

    const colors = new Float32Array(geometry.attributes.position.count * 3);
    const positions = geometry.attributes.position.array;

    for (let i = 0; i < colors.length; i += 3) {
      const vIdx = i / 3;
      const px = positions[vIdx * 3];
      const pz = positions[vIdx * 3 + 2];

      // Create natural-looking grass with Perlin-like variation
      const dist = Math.sqrt(px * px + pz * pz) * 0.02;
      const wave = Math.sin(px * 0.15) * Math.cos(pz * 0.15) * 0.06;
      const variation = wave + Math.sin(dist * 3.0) * 0.04;

      colors[i]     = 0.28 + variation;             // R - warm green
      colors[i + 1] = 0.55 + variation + 0.05;      // G - rich green
      colors[i + 2] = 0.18 + variation * 0.5;       // B - earthy
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.9,
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