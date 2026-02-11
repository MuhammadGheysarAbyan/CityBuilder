# 🏙️ 3D City Builder Game

A web-based 3D city building simulation game built with **Three.js** and modern web technologies.

## 🎮 Features

- **3D Isometric View** with smooth camera controls
- **Grid-Based Building System** with smart placement validation
- **Real-Time Simulation** for citizens, economy, and resources
- **Multiple Building Types**: Residential, Commercial, Industrial, Utilities, Services
- **Resource Management**: Power, Water, Waste
- **Economy System**: Income from taxes, maintenance costs
- **Population Growth** based on happiness and employment
- **Modern UI** with intuitive controls

## 🚀 Quick Start

### Installation

```bash
# Clone or extract the project
cd city-builder-3d

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open automatically in your browser at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎯 How to Play

1. **Camera Controls**:
   - **Left Click + Drag**: Rotate view
   - **Right Click + Drag**: Pan
   - **Scroll**: Zoom in/out

2. **Building**:
   - Select a building from the bottom menu
   - Click on the grid to place (green = valid, red = invalid)
   - Right-click to cancel placement
   - Buildings need road access (except roads)

3. **Time Controls** (top-right):
   - ⏸️ Pause
   - ▶️ Normal speed
   - ⏩ Fast forward (3x)

4. **Information**:
   - Click on any building to see details
   - Monitor your money, population, and resources in the top HUD

## 🏗️ Building Types

### Zones
- **🏘️ Residential** ($100) - Houses citizens
- **🏢 Commercial** ($200) - Provides jobs, generates income
- **🏭 Industrial** ($150) - Provides jobs, production

### Infrastructure
- **🛣️ Road** ($10) - Required for buildings
- **⚡ Power Plant** ($500) - Provides electricity
- **💧 Water Tower** ($300) - Provides water
- **🗑️ Waste Facility** ($400) - Manages garbage

### Services
- **🚓 Police Station** ($250) - Reduces crime
- **🏥 Hospital** ($300) - Improves health
- **🏫 School** ($200) - Improves education

## 📁 Project Structure

```
city-builder-3d/
├── src/
│   ├── core/           # Engine, Scene, Input, Time
│   ├── world/          # Grid, WorldManager
│   ├── buildings/      # BuildingManager, Placement
│   ├── simulation/     # Citizens, Economy
│   ├── ui/             # UIManager
│   ├── data/           # GameState, Constants
│   ├── utils/          # Utilities
│   └── styles/         # CSS
├── index.html
├── package.json
└── vite.config.js
```

## ⚙️ Technical Details

- **Engine**: Three.js for 3D rendering
- **Architecture**: Dual-loop (60 FPS render + 2 TPS simulation)
- **Optimization**: InstancedMesh for buildings, LOD ready
- **Performance**: Handles 1000+ buildings smoothly

## 🎨 Customization

### Add New Building Types

Edit `src/buildings/BuildingData.js`:

```javascript
my_building: {
  width: 1,
  depth: 1,
  height: 10,
  cost: 300,
  maintenance: 20,
  requiresRoad: true
}
```

Add color in `src/data/Constants.js`

## 📝 Development Roadmap

- [x] Core engine & rendering
- [x] Grid system & building placement
- [x] Basic simulation (citizens, economy)
- [x] UI/UX
- [ ] Advanced traffic simulation
- [ ] Disasters & events
- [ ] Save/Load system
- [ ] Advanced graphics (particles, effects)
- [ ] Sound effects & music
- [ ] Multiplayer (future)

## 🐛 Known Issues

- Building demolition doesn't refund money (feature, not bug!)
- No pathfinding for traffic yet
- Limited terrain variation

## 📄 License

MIT License - Feel free to modify and use!

## 👨‍💻 Created By

**AntiGravity Developer Team**

Built with ❤️ using Three.js
