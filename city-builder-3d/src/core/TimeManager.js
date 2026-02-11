/**
 * TimeManager.js - Manage game time and simulation speed
 */

export class TimeManager {
  constructor() {
    this.timeScale = 1; // 1x speed
    this.isPaused = false;
    this.TICK_INTERVAL = 500; // 500ms = 2 ticks per second
    this.gameTime = 0;
  }

  update(deltaTime) {
    if (!this.isPaused) {
      this.gameTime += deltaTime * this.timeScale;
    }
  }

  pause() {
    this.isPaused = true;
  }

  play() {
    this.isPaused = false;
    this.timeScale = 1;
  }

  fastForward() {
    this.isPaused = false;
    this.timeScale = 3;
  }

  setSpeed(speed) {
    this.timeScale = speed;
    if (speed === 0) {
      this.isPaused = true;
    } else {
      this.isPaused = false;
    }
  }

  getFormattedTime() {
    const totalSeconds = Math.floor(this.gameTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}
