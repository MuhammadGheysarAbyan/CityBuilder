/**
 * InputManager.js - Handle mouse and keyboard input
 */

import * as THREE from 'three';

export class InputManager {
  constructor(canvas, camera) {
    this.canvas = canvas;
    this.camera = camera;
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.listeners = {};
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.canvas.addEventListener('click', this.onClick.bind(this));
    this.canvas.addEventListener('contextmenu', this.onRightClick.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  onClick(event) {
    this.updateMouse(event);
    this.emit('click', { mouse: this.mouse, raycaster: this.raycaster, point: this.getIntersectionPoint() });
  }

  onRightClick(event) {
    event.preventDefault();
    this.emit('rightclick', {});
  }

  onMouseMove(event) {
    this.updateMouse(event);
    this.emit('mousemove', { mouse: this.mouse, raycaster: this.raycaster });
  }

  updateMouse(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
  }

  getIntersectionPoint() {
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const point = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(plane, point);
    return point;
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  update() {
    // Update logic if needed
  }
}
