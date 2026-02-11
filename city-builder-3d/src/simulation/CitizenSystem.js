export class CitizenSystem {
  constructor(gameState) {
    this.gameState = gameState;
    this.targetHappiness = 0.7;
  }

  update(deltaTime, buildings) {
    // Population growth
    buildings.forEach(building => {
      if (building.type === 'residential') {
        const growthRate = this.gameState.happiness * 0.02;
        building.population = Math.min(
          (building.population || 0) + growthRate * deltaTime,
          building.data.capacity
        );
      }
    });

    // Calculate happiness smoothly (no random flicker)
    const hasServices = this.calculateServiceScore(buildings);
    const employmentFactor = this.gameState.employment * 0.3;
    const powerFactor = this.gameState.powerCapacity > 0
      ? Math.min(this.gameState.powerCapacity / Math.max(this.gameState.powerUsage, 1), 1) * 0.15
      : 0;
    const waterFactor = this.gameState.waterCapacity > 0
      ? Math.min(this.gameState.waterCapacity / Math.max(this.gameState.waterUsage, 1), 1) * 0.15
      : 0;

    this.targetHappiness = Math.max(0, Math.min(1,
      0.3 + employmentFactor + powerFactor + waterFactor + hasServices
    ));

    // Smooth lerp towards target (no flicker!)
    this.gameState.happiness += (this.targetHappiness - this.gameState.happiness) * 0.05;
    this.gameState.happiness = Math.max(0, Math.min(1, this.gameState.happiness));
  }

  calculateServiceScore(buildings) {
    let score = 0;
    const hasPolice = buildings.some(b => b.type === 'police');
    const hasHospital = buildings.some(b => b.type === 'hospital');
    const hasSchool = buildings.some(b => b.type === 'school');

    if (hasPolice) score += 0.07;
    if (hasHospital) score += 0.07;
    if (hasSchool) score += 0.06;
    return score;
  }
}
