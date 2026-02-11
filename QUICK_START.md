# 🏙️ 3D City Builder - Quick Start Guide

## 📦 Installation Steps

### 1. Extract the ZIP file
```bash
unzip city-builder-3d.zip
cd city-builder-3d
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

The game will automatically open in your browser at `http://localhost:3000`

## 🎮 Controls

### Camera
- **Left Click + Drag**: Rotate view
- **Right Click + Drag**: Pan camera
- **Mouse Wheel**: Zoom in/out

### Building
1. Click building from bottom menu
2. Move mouse to position (green = valid, red = invalid)
3. Left click to place
4. Right click to cancel

### Time
- ⏸️ **Pause** - Stop simulation
- ▶️ **Play** - Normal speed (1x)
- ⏩ **Fast** - Speed up (3x)

## 💡 Tips for Success

1. **Always build roads first** - Most buildings need road access
2. **Balance your budget** - Buildings cost money to maintain
3. **Watch your happiness** - Happy citizens = population growth
4. **Plan power early** - Build power plants before running out
5. **Zone strategically** - Keep industrial away from residential

## 🏗️ Building Strategy

### Early Game (0-5000 population)
1. Build a few roads in a grid pattern
2. Place 5-10 residential zones
3. Add 2-3 commercial buildings
4. Build 1 power plant
5. Monitor money carefully

### Mid Game (5000-20000 population)
1. Expand road network
2. Balance residential/commercial ratio
3. Add industrial for jobs
4. Build water tower
5. Add police and hospital

### Late Game (20000+ population)
1. Optimize city layout
2. Add all services (school, hospital, police)
3. Manage traffic congestion
4. Maximize happiness
5. Expand to grid limits

## 📊 Understanding Stats

### HUD (Top Bar)
- **💰 Money**: Current budget
- **👥 Population**: Total citizens
- **😊 Happiness**: Citizen satisfaction (0-100%)
- **⚡ Power**: Usage / Capacity
- **💧 Water**: Usage / Capacity

### Building Info (Click any building)
- Grid position
- Maintenance cost
- Population (for residential)
- Workers (for commercial/industrial)

## 🐛 Troubleshooting

### Game won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Buildings won't place
- Check if you have enough money
- Ensure green preview (valid placement)
- Make sure road access exists
- Verify tiles are not occupied

### Poor performance
- Reduce number of buildings
- Close other browser tabs
- Use Chrome/Edge for best performance
- Lower screen resolution if needed

## 🎯 Goals to Try

- [ ] Reach 10,000 population
- [ ] Keep happiness above 80%
- [ ] Build a city worth $100,000
- [ ] Create a perfect grid layout
- [ ] Max out all resources

## 📝 Notes

- Buildings cannot be moved (only demolished for $50 refund)
- Save/load not yet implemented - design carefully!
- Simulation runs even when paused (use for planning)

## 🚀 What's Next?

Check `README.md` for:
- Full technical documentation
- Architecture details
- How to add custom buildings
- Development roadmap

---

**Have fun building your city! 🏙️✨**

Created by **AntiGravity Team** with ❤️
