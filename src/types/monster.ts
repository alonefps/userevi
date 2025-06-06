export interface Monster {
  id: string;
  name: string;
  attack: number;
  defense: number;
  speed: number;
  hp: number;
  maxHp: number;
  imageUrl: string;
}

export interface BattleRound {
  attacker: Monster;
  defender: Monster;
  damage: number;
  defenderHpAfter: number;
}

export interface BattleResult {
  monster1: Monster;
  monster2: Monster;
  rounds: BattleRound[];
  winner: Monster;
  loser: Monster;
} 