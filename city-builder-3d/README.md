# 🏙️ 3D City Builder Game — AntiGravity Edition

A premium web-based 3D city building simulation game built with **Three.js**. Experience detailed procedural buildings, real-time economy simulation, and beautiful glassmorphism UI.

![City Builder](https://raw.githubusercontent.com/antigravity-team/city-builder-3d/main/preview.png)

## ✨ New Features

- **Standard Material Rendering**: Rich lighting with sun, ambient, and fill lights + fog for depth.
- **Procedural 3D Models**: Unique geometries for every building type:
  - 🏠 **Residential**: Modern houses with garages and porches.
  - 🏢 **Commercial**: Skyscrapers with antenna and roof details.
  - 🏭 **Industrial**: Factories with smokestacks and sawtooth roofs.
  - ⚡ **Power Plant**: Nuclear style with cooling towers.
  - 🏥 **Hospital**: Complex wing structure with cross.
- **Smart Placement System**: 
  - Preview shows *exact* building shape before placing.
  - **Continuous placement** (hold shift or just click multiple times).
  - Toast notifications for feedback (e.g., "❌ Needs road access").
- **Glassmorphism UI**: Modern aesthetic with blur effects, smooth animations, and Inter font.
- **Toast Notifications**: Non-blocking alerts for gameplay feedback.

## 🚀 Quick Start

### Installation

```bash
# 1. Enter the project directory
cd city-builder-3d

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The game will open automatically at `http://localhost:3000`

## 🎮 Controls

### Camera
| Action | Control |
|--------|---------|
| **Rotate** | Left Click + Drag |
| **Pan** | Right Click + Drag |
| **Zoom** | Scroll Wheel |

### Building
1. Select a category (Zones, Roads, Utilities, Services).
2. Click a building card.
3. Move mouse to grid — **Green** means valid, **Red** means invalid.
4. **Left Click** to build.
5. **Right Click** or press Cancel button to stop building.

### Economy
- **Money**: Earned tax from Population/Jobs. Spent on construction & maintenance.
- **Population**: Grows when Happiness is high and jobs are available.
- **Resources**: Manage **Power** ⚡ and **Water** 💧 capacity.

## 🏗️ Building Types

### Zones
- **Residential** ($100): Houses citizens. Needs road access.
- **Commercial** ($200): Provides jobs & tax. Needs road access.
- **Industrial** ($150): High employment, high pollution. Needs road access.

### Infrastructure
- **Road** ($10): Basic connectivity.
- **Avenue** ($20): Wider road with median trees.
- **Power Plant** ($500): Generates 200 Power.
- **Water Tower** ($300): Provides 150 Water.
- **Waste Facility** ($400): Manages city waste.

### Services
- **Police Station**: Reduces crime, boosts happiness.
- **Hospital**: Improves health coverage.
- **School**: Increases education level.

## 🛠️ Tech Stack

- **Three.js**: 3D Rendering Engine
- **Vite**: Ultra-fast build tool
- **Vanilla JS**: ES6+ modules for core logic
- **CSS3**: Variables, Flexbox, Grid, Backdrop Filter

## 📝 Credits

Created by **AntiGravity Developer Team** with ❤️
