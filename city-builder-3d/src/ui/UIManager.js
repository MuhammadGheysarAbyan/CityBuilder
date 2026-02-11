import { EventEmitter } from '../utils/EventEmitter.js';

export class UIManager extends EventEmitter {
  constructor(gameState, timeManager, placementSystem, buildingManager, worldManager) {
    super();
    this.gameState = gameState;
    this.timeManager = timeManager;
    this.placementSystem = placementSystem;
    this.buildingManager = buildingManager;
    this.worldManager = worldManager;
    this.selectedBuilding = null;

    this.setupEventListeners();
    this.setupToastContainer();
  }

  setupToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    this.toastContainer = container;

    // Listen for toast events from placement system
    this.placementSystem.on('showToast', (data) => {
      this.showToast(data.message, data.type);
    });
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    this.toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  }

  setupEventListeners() {
    // Time controls
    document.getElementById('pause').addEventListener('click', () => {
      this.timeManager.pause();
      this.updateTimeButtons();
    });

    document.getElementById('play').addEventListener('click', () => {
      this.timeManager.play();
      this.updateTimeButtons();
    });

    document.getElementById('fast').addEventListener('click', () => {
      this.timeManager.fastForward();
      this.updateTimeButtons();
    });

    // Building menu tabs
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const category = e.currentTarget.dataset.category;
        if (category) this.switchCategory(category);
      });
    });

    // Building cards
    document.querySelectorAll('.building-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.type;
        // Highlight selected card
        document.querySelectorAll('.building-card').forEach(c => c.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        this.emit('buildingSelected', type);
        document.getElementById('cancel-build').style.display = 'block';
      });
    });

    // Cancel build
    document.getElementById('cancel-build').addEventListener('click', () => {
      this.placementSystem.cancelPlacement();
      document.getElementById('cancel-build').style.display = 'none';
      document.querySelectorAll('.building-card').forEach(c => c.classList.remove('selected'));
    });

    // Overlay controls
    document.querySelectorAll('#overlay-controls button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('#overlay-controls button').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    // Demolish button
    document.getElementById('demolish-btn').addEventListener('click', () => {
      const building = this.selectedBuilding;
      if (building) {
        this.emit('demolish', building);
        this.hideBuildingInfo();
        this.gameState.updateMoney(50);
        this.showToast('🔨 Building demolished! +$50', 'success');
      }
    });

    // Placement events
    this.placementSystem.on('placementCancelled', () => {
      document.getElementById('cancel-build').style.display = 'none';
      document.querySelectorAll('.building-card').forEach(c => c.classList.remove('selected'));
    });

    this.placementSystem.on('buildingPlaced', (type) => {
      // Don't cancel placement or hide cancel button — continuous building!
      this.showToast(`✅ ${type.replace('_', ' ')} placed!`, 'success');
    });
  }

  switchCategory(category) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector(`[data-category="${category}"]`);
    if (activeTab) activeTab.classList.add('active');
    document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
    const activeCategory = document.getElementById(category);
    if (activeCategory) activeCategory.classList.add('active');
  }

  updateTimeButtons() {
    document.querySelectorAll('.time-controls button[id]').forEach(b => b.classList.remove('active'));
    if (this.timeManager.isPaused) {
      document.getElementById('pause').classList.add('active');
    } else if (this.timeManager.timeScale === 3) {
      document.getElementById('fast').classList.add('active');
    } else {
      document.getElementById('play').classList.add('active');
    }
    document.getElementById('speed').textContent = this.timeManager.isPaused ? '0x' : `${this.timeManager.timeScale}x`;
  }

  showBuildingInfo(building) {
    this.selectedBuilding = building;
    const panel = document.getElementById('info-panel');
    const title = document.getElementById('info-title');
    const content = document.getElementById('info-content');

    const typeLabel = building.type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    title.textContent = typeLabel;
    content.innerHTML = `
      <div class="info-row"><span>📍 Grid Position</span><span>${building.gridX}, ${building.gridZ}</span></div>
      <div class="info-row"><span>💸 Maintenance</span><span>$${building.data.maintenance}/tick</span></div>
      ${building.population !== undefined ? `<div class="info-row"><span>👥 Population</span><span>${Math.floor(building.population)}/${building.data.capacity}</span></div>` : ''}
      ${building.workers !== undefined ? `<div class="info-row"><span>👷 Workers</span><span>${building.workers}/${building.data.jobs}</span></div>` : ''}
    `;
    panel.style.display = 'block';
  }

  hideBuildingInfo() {
    document.getElementById('info-panel').style.display = 'none';
    this.selectedBuilding = null;
  }

  formatNumber(num) {
    return Math.floor(num).toLocaleString();
  }

  update(dt) {
    document.getElementById('money').textContent = `$${this.formatNumber(this.gameState.money)}`;
    document.getElementById('population').textContent = this.formatNumber(this.gameState.population);
    document.getElementById('happiness').textContent = `${Math.floor(this.gameState.happiness * 100)}%`;
    document.getElementById('power').textContent = `${Math.floor(this.gameState.powerUsage)}/${Math.floor(this.gameState.powerCapacity)}`;
    document.getElementById('water').textContent = `${Math.floor(this.gameState.waterUsage)}/${Math.floor(this.gameState.waterCapacity)}`;

    // Color-code money
    const moneyEl = document.getElementById('money');
    if (this.gameState.money < 500) {
      moneyEl.style.color = '#ff6b6b';
    } else if (this.gameState.money < 5000) {
      moneyEl.style.color = '#ffd93d';
    } else {
      moneyEl.style.color = '';
    }
  }
}
