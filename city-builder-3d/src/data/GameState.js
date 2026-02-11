export class GameState {
  constructor() {
    this.money = 50000; this.income = 0; this.expenses = 0;
    this.population = 0; this.happiness = 1.0; this.employment = 0;
    this.powerCapacity = 0; this.powerUsage = 0;
    this.waterCapacity = 0; this.waterUsage = 0;
    this.buildings = []; this.roads = [];
  }
  updateMoney(amount) { this.money += amount; }
  canAfford(cost) { return this.money >= cost; }
  addBuilding(building) { this.buildings.push(building); }
  removeBuilding(building) {
    const index = this.buildings.indexOf(building);
    if (index > -1) this.buildings.splice(index, 1);
  }
}