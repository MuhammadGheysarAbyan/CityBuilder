/**
 * SceneManager.js - Premium 3D Scene with gradient sky, day/night cycle, and cinematic lighting
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.dayTime = 0.35; // Start at mid-morning (0=midnight, 0.5=noon, 1=midnight)
    this.daySpeed = 0.008; // Full cycle speed

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
    this.renderer.toneMappingExposure = 1.2;
  }

  setupScene() {
    this.scene = new THREE.Scene();

    // Gradient sky sphere (like DisasterSurvival)
    const skyGeo = new THREE.SphereGeometry(300, 32, 32);
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x2B6CB0) },
        bottomColor: { value: new THREE.Color(0xB8D4E8) },
        sunColor: { value: new THREE.Color(0xFFE4B5) },
        sunDirection: { value: new THREE.Vector3(0.4, 0.6, 0.3).normalize() },
        offset: { value: 20 },
        exponent: { value: 0.4 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform vec3 sunColor;
        uniform vec3 sunDirection;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          vec3 skyColor = mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0));
          // Sun glow
          vec3 viewDir = normalize(vWorldPosition);
          float sunDot = max(dot(viewDir, sunDirection), 0.0);
          float sunGlow = pow(sunDot, 32.0) * 0.5 + pow(sunDot, 256.0) * 1.0;
          skyColor += sunColor * sunGlow;
          gl_FragColor = vec4(skyColor, 1.0);
        }
      `,
      side: THREE.BackSide
    });
    this.sky = new THREE.Mesh(skyGeo, this.skyMat);
    this.scene.add(this.sky);

    this.scene.fog = new THREE.FogExp2(0x9DC8E3, 0.005);
  }

  setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 500);
    this.camera.position.set(35, 35, 35);
    this.camera.lookAt(0, 0, 0);
  }

  setupLights() {
    // Hemisphere — sky blue top, warm ground bounce
    this.hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x8B7D5E, 0.4);
    this.scene.add(this.hemiLight);

    // Ambient — soft warm base
    this.ambient = new THREE.AmbientLight(0xfff5e6, 0.35);
    this.scene.add(this.ambient);

    // Main sun — warm golden
    this.sun = new THREE.DirectionalLight(0xFFF4E0, 1.2);
    this.sun.position.set(60, 100, 40);
    this.sun.castShadow = true;

    // Enhanced shadow settings (4096)
    this.sun.shadow.camera.left = -80;
    this.sun.shadow.camera.right = 80;
    this.sun.shadow.camera.top = 80;
    this.sun.shadow.camera.bottom = -80;
    this.sun.shadow.camera.near = 0.5;
    this.sun.shadow.camera.far = 300;
    this.sun.shadow.mapSize.width = 4096;
    this.sun.shadow.mapSize.height = 4096;
    this.sun.shadow.bias = -0.0003;
    this.sun.shadow.normalBias = 0.02;
    this.scene.add(this.sun);

    // Fill light — cool blue
    this.fillLight = new THREE.DirectionalLight(0xB0D4F1, 0.3);
    this.fillLight.position.set(-30, 40, -30);
    this.scene.add(this.fillLight);
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

  updateDayNight(dt) {
    this.dayTime = (this.dayTime + this.daySpeed * dt) % 1.0;

    // Sun angle based on time of day
    const sunAngle = this.dayTime * Math.PI * 2 - Math.PI / 2;
    const sunY = Math.sin(sunAngle);
    const sunX = Math.cos(sunAngle) * 0.6;
    const sunZ = Math.cos(sunAngle) * 0.4;

    this.sun.position.set(sunX * 80, Math.max(sunY * 100, 5), sunZ * 60);

    // Sky colors based on time
    const isDay = sunY > 0;
    const twilight = Math.max(0, Math.min(1, (sunY + 0.2) / 0.4)); // smooth 0-1

    // Day colors
    const dayTop = new THREE.Color(0x2B6CB0);
    const dayBottom = new THREE.Color(0xB8D4E8);
    // Sunset colors
    const sunsetTop = new THREE.Color(0x1A237E);
    const sunsetBottom = new THREE.Color(0xFF6F00);
    // Night colors
    const nightTop = new THREE.Color(0x0D1B2A);
    const nightBottom = new THREE.Color(0x1B2838);

    let topColor, bottomColor;
    if (twilight > 0.5) {
      // Day
      const t = (twilight - 0.5) * 2;
      topColor = sunsetTop.clone().lerp(dayTop, t);
      bottomColor = sunsetBottom.clone().lerp(dayBottom, t);
    } else {
      // Night to sunset
      const t = twilight * 2;
      topColor = nightTop.clone().lerp(sunsetTop, t);
      bottomColor = nightBottom.clone().lerp(sunsetBottom, t);
    }

    this.skyMat.uniforms.topColor.value.copy(topColor);
    this.skyMat.uniforms.bottomColor.value.copy(bottomColor);
    this.skyMat.uniforms.sunDirection.value.set(sunX, Math.max(sunY, 0.05), sunZ).normalize();

    // Sun light intensity based on time
    this.sun.intensity = Math.max(0.1, twilight * 1.2);
    this.sun.color.lerpColors(new THREE.Color(0xFF8A65), new THREE.Color(0xFFF4E0), twilight);

    // Ambient intensity
    this.ambient.intensity = 0.15 + twilight * 0.25;
    this.hemiLight.intensity = 0.15 + twilight * 0.35;

    // Fog color blends with sky
    const fogColor = bottomColor.clone().lerp(topColor, 0.3);
    this.scene.fog.color.copy(fogColor);

    // Exposure adjusts for brightness
    this.renderer.toneMappingExposure = 0.6 + twilight * 0.7;

    return { dayTime: this.dayTime, isDay, twilight };
  }

  getDayTimeInfo() {
    const hours = Math.floor(this.dayTime * 24);
    const minutes = Math.floor((this.dayTime * 24 - hours) * 60);
    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    const isDay = this.dayTime > 0.25 && this.dayTime < 0.75;
    return { timeString: `${h}:${m}`, isDay, dayTime: this.dayTime };
  }

  update(dt) {
    this.controls.update();
    this.updateDayNight(dt);
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
