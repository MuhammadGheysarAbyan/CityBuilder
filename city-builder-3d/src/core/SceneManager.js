/**
 * SceneManager.js - Enhanced Three.js Scene Setup with premium lighting
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;

    this.setupRenderer();
    this.setupScene();
    this.setupCamera();
    this.setupLights();
    this.setupControls();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x7EC8E3);
    this.scene.fog = new THREE.FogExp2(0x9DC8E3, 0.006);
  }

  setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 500);

    // Nice isometric-style starting position
    this.camera.position.set(35, 35, 35);
    this.camera.lookAt(0, 0, 0);
  }

  setupLights() {
    // Ambient — soft bluish base
    const ambient = new THREE.AmbientLight(0x8EBBFF, 0.4);
    this.scene.add(ambient);

    // Main direct sun — warm golden
    this.sun = new THREE.DirectionalLight(0xFFF4E0, 1.2);
    this.sun.position.set(60, 100, 40);
    this.sun.castShadow = true;

    // Shadow settings
    this.sun.shadow.camera.left = -80;
    this.sun.shadow.camera.right = 80;
    this.sun.shadow.camera.top = 80;
    this.sun.shadow.camera.bottom = -80;
    this.sun.shadow.camera.near = 0.5;
    this.sun.shadow.camera.far = 300;
    this.sun.shadow.mapSize.width = 2048;
    this.sun.shadow.mapSize.height = 2048;
    this.sun.shadow.bias = -0.0002;
    this.sun.shadow.normalBias = 0.02;
    this.scene.add(this.sun);

    // Fill light — cool blue from opposite side
    const fill = new THREE.DirectionalLight(0xB0D4F1, 0.3);
    fill.position.set(-30, 40, -30);
    this.scene.add(fill);

    // Hemisphere — sky blue top, warm ground bounce
    const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x8B7D5E, 0.35);
    this.scene.add(hemiLight);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 100;
    this.controls.maxPolarAngle = Math.PI / 2.3;
    this.controls.target.set(0, 0, 0);
    this.controls.screenSpacePanning = false;
    this.controls.rotateSpeed = 0.6;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
  }

  update(dt) {
    this.controls.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }
}
