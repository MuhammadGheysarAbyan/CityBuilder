export class EconomySystem {
  constructor(gameState) {
    this.gameState = gameState;
  }

  update(deltaTime, buildings) {
    let income = 0, expenses = 0;
    
    buildings.forEach(building => {
      if (building.type === 'residential') {
        income += (building.population || 0) * 0.5 * deltaTime;
      }
      if (building.type === 'commercial') {
        income += (building.workers || 0) * 1.0 * deltaTime;
      }
      expenses += (building.data.maintenance || 0) * deltaTime;
    });
    
    this.gameState.income = income;
    this.gameState.expenses = expenses;
    this.gameState.updateMoney(income - expenses);
  }
}
