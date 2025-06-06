import { Monster, BattleRound, BattleResult } from '@/types/monster';

export function calculateDamage(attacker: Monster, defender: Monster): number {
  const damage = attacker.attack - defender.defense;
  return damage <= 0 ? 1 : damage;
}

export function determineFirstAttacker(monster1: Monster, monster2: Monster): [Monster, Monster] {
  if (monster1.speed > monster2.speed) {
    return [monster1, monster2];
  } else if (monster2.speed > monster1.speed) {
    return [monster2, monster1];
  } else {
    return monster1.attack >= monster2.attack ? [monster1, monster2] : [monster2, monster1];
  }
}

export function simulateBattle(monster1: Monster, monster2: Monster): BattleResult {
  const [firstAttacker, secondAttacker] = determineFirstAttacker(monster1, monster2);

  const fighter1 = { ...firstAttacker, hp: firstAttacker.maxHp };
  const fighter2 = { ...secondAttacker, hp: secondAttacker.maxHp };

  const rounds: BattleRound[] = [];
  let currentAttacker = fighter1;
  let currentDefender = fighter2;

  while (fighter1.hp > 0 && fighter2.hp > 0) {
    const damage = calculateDamage(currentAttacker, currentDefender);
    currentDefender.hp = Math.max(0, currentDefender.hp - damage);

    rounds.push({
      attacker: { ...currentAttacker },
      defender: { ...currentDefender },
      damage,
      defenderHpAfter: currentDefender.hp
    });

    if (currentDefender.hp <= 0) {
      break;
    }

    [currentAttacker, currentDefender] = [currentDefender, currentAttacker];
  }

  const winner = fighter1.hp > 0 ? fighter1 : fighter2;
  const loser = fighter1.hp > 0 ? fighter2 : fighter1;

  return {
    monster1: { ...monster1 },
    monster2: { ...monster2 },
    rounds,
    winner: { ...winner },
    loser: { ...loser }
  };
} 