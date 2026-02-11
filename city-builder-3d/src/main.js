/**
 * 3D City Builder - Main Entry Point
 * AntiGravity Edition
 */

import { Engine } from './core/Engine.js';

// Initialize the game
const canvas = document.getElementById('canvas');
const engine = new Engine(canvas);

// Start the game after loading
window.addEventListener('load', () => {
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
    engine.start();
  }, 1500);
});

// Handle window resize
window.addEventListener('resize', () => {
  engine.onWindowResize();
});

// Expose engine to window for debugging
window.engine = engine;

console.log('🏙️ City Builder 3D - AntiGravity Edition');
console.log('Use window.engine to access game engine');
