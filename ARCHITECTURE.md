# 🏗️ Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────┐
│           PRESENTATION LAYER                 │
│  ┌──────────┐  ┌─────────┐  ┌──────────┐   │
│  │ Three.js │  │   UI    │  │ Controls │   │
│  │ Renderer │  │  HUD    │  │  Input   │   │
│  └──────────┘  └─────────┘  └──────────┘   │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│             GAME LOGIC LAYER                 │
│  ┌───────────┐  ┌──────────┐  ┌─────────┐  │
│  │   World   │  │ Building │  │  State  │  │
│  │  Manager  │  │  System  │  │ Manager │  │
│  └───────────┘  └──────────┘  └─────────┘  │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│           SIMULATION LAYER                   │
│  ┌──────────┐  ┌─────────┐  ┌──────────┐   │
│  │ Citizens │  │ Economy │  │ Traffic  │   │
│  │  System  │  │ System  │  │  System  │   │
│  └──────────┘  └─────────┘  └──────────┘   │
└─────────────────────────────────────────────┘
```

## Dual-Loop Architecture

### Render Loop (60 FPS)
- Camera updates
- Mesh rendering
- UI updates
- Visual effects

### Simulation Tick (2 TPS)
- Citizen calculations
- Economy updates
- Resource distribution
- Event triggers

## Key Classes

### Engine.js
Main controller that orchestrates all systems

### SceneManager.js
Three.js scene setup, camera, lights

### WorldManager.js
Grid system and terrain management

### BuildingManager.js
Uses InstancedMesh for optimal rendering

### SimulationManager.js
Coordinates all simulation systems

## Performance Optimizations

1. **InstancedMesh**: Single draw call per building type
2. **Tick-based simulation**: Heavy calculations at 2 Hz
3. **Chunk system ready**: For large cities
4. **Event-driven**: Minimal polling

## Data Flow

```
User Input → InputManager → Engine
              ↓
     PlacementSystem → BuildingManager
              ↓
        Grid Update → WorldManager
              ↓
      GameState → SimulationManager
              ↓
        UI Update → UIManager
```

## Extension Points

Add new systems by:
1. Create system class in `src/simulation/`
2. Register in SimulationManager
3. Update GameState if needed
4. Add UI in UIManager

---

**Tech Stack:**
- Three.js (3D rendering)
- Vite (build tool)
- Vanilla JS (no framework overhead)
