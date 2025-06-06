"use client";

import { useState, useEffect } from "react";
import { BattleResult, BattleRound } from "@/types/monster";
import { StickFighter } from "./StickFighter";

interface BattleViewerProps {
  battleResult: BattleResult;
  onClose: () => void;
}

export function BattleViewer({ battleResult, onClose }: BattleViewerProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [monster1Hp, setMonster1Hp] = useState(battleResult.monster1.maxHp);
  const [monster2Hp, setMonster2Hp] = useState(battleResult.monster2.maxHp);
  const [attackingMonster, setAttackingMonster] = useState<string | null>(null);
  const [defendingMonster, setDefendingMonster] = useState<string | null>(null);
  const [showProjectile, setShowProjectile] = useState(false);
  const [hitTarget, setHitTarget] = useState<string | null>(null);

  useEffect(() => {
    if (currentRound < battleResult.rounds.length) {
      const timer = setTimeout(() => {
        const round = battleResult.rounds[currentRound];

        setAttackingMonster(round.attacker.id);
        setDefendingMonster(round.defender.id);
        setShowProjectile(true);

        setTimeout(() => {
          setShowProjectile(false);
          setHitTarget(round.defender.id);

          if (round.defender.id === battleResult.monster1.id) {
            setMonster1Hp(round.defenderHpAfter);
          } else {
            setMonster2Hp(round.defenderHpAfter);
          }
        }, 600);

        setTimeout(() => {
          setHitTarget(null);
          setAttackingMonster(null);
          setDefendingMonster(null);
          setCurrentRound((prev) => prev + 1);
        }, 1800);
      }, 1200);

      return () => clearTimeout(timer);
    } else if (currentRound >= battleResult.rounds.length && !showResult) {
      setTimeout(() => setShowResult(true), 1000);
    }
  }, [
    currentRound,
    battleResult.rounds.length,
    battleResult.rounds,
    showResult,
    battleResult.monster1.id,
  ]);

  const getCurrentRound = (): BattleRound | null => {
    return currentRound > 0 ? battleResult.rounds[currentRound - 1] : null;
  };

  const round = getCurrentRound();
  const monster1HpPercentage = (monster1Hp / battleResult.monster1.maxHp) * 100;
  const monster2HpPercentage = (monster2Hp / battleResult.monster2.maxHp) * 100;

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
      <div
        className="relative h-full"
        style={{
          background:
            "linear-gradient(180deg, #1a4c96 0%, #2d5aa0 30%, #87ceeb 70%, #98fb98 100%)",
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `,
        }}
      >
        <div className="relative z-10 p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-yellow-400 font-bold text-lg">1P</div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold text-2xl glow-text">
                {currentRound < battleResult.rounds.length
                  ? `RODADA ${currentRound + 1}`
                  : showResult
                  ? "LUTE!"
                  : "PRONTO?"}
              </div>
              {!showResult && (
                <div className="text-white text-sm">
                  {currentRound < battleResult.rounds.length
                    ? `${
                        battleResult.rounds.length - currentRound
                      } rodadas restantes`
                    : "Processando..."}
                </div>
              )}
            </div>
            <div className="text-yellow-400 font-bold text-lg">2P</div>
          </div>

          <div className="flex justify-between items-center gap-4 mb-2">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-yellow-400 font-bold">
                  {battleResult.monster1.name.toUpperCase()}
                </span>
                <span className="text-white">
                  {monster1Hp}/{battleResult.monster1.maxHp}
                </span>
              </div>
              <div className="relative h-6 bg-gray-800 border-2 border-yellow-400 rounded">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500 rounded"
                  style={{ width: `${monster1HpPercentage}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
              </div>
            </div>

            <div className="w-32 flex justify-center">
              {round && !showResult ? (
                <div className="text-center bg-black/80 border-2 border-yellow-400 rounded px-3 py-1">
                  <div className="text-red-400 text-sm font-bold">
                    💥 -{round.damage} DMG
                  </div>
                </div>
              ) : showResult ? (
                <div className="text-center bg-black/80 border-2 border-yellow-400 rounded px-3 py-1">
                  <div className="text-yellow-400 text-lg font-bold glow-text">
                    K.O.
                  </div>
                </div>
              ) : (
                <div className="w-20 h-8"></div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white">
                  {monster2Hp}/{battleResult.monster2.maxHp}
                </span>
                <span className="text-yellow-400 font-bold">
                  {battleResult.monster2.name.toUpperCase()}
                </span>
              </div>
              <div className="relative h-6 bg-gray-800 border-2 border-yellow-400 rounded">
                <div
                  className="absolute top-0 right-0 h-full bg-gradient-to-l from-red-500 via-yellow-500 to-green-500 transition-all duration-500 rounded"
                  style={{ width: `${monster2HpPercentage}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-end justify-between px-8 pb-8 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`transition-all duration-300 ${
                hitTarget === battleResult.monster1.id ? "animate-pulse" : ""
              }`}
            >
              <div
                className={`${
                  hitTarget === battleResult.monster1.id
                    ? "ring-4 ring-red-500 ring-opacity-75 rounded-full"
                    : ""
                }`}
              >
                <StickFighter
                  monster={battleResult.monster1}
                  isAttacking={attackingMonster === battleResult.monster1.id}
                  isDefending={defendingMonster === battleResult.monster1.id}
                  position="left"
                  showProjectile={
                    showProjectile &&
                    attackingMonster === battleResult.monster1.id
                  }
                />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-center z-20">
            {showResult && (
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-4 border-yellow-400 rounded-lg p-8 text-center">
                <div className="text-4xl font-bold text-yellow-400 glow-text mb-4 animate-bounce">
                  🏆 VENCEDOR! 🏆
                </div>
                <div className="text-3xl text-orange-400 font-bold mb-2">
                  {battleResult.winner.name.toUpperCase()}
                </div>
                <div className="text-lg text-cyan-400 mb-4">
                  VITÓRIA PERFEITA!
                </div>
                <div className="text-sm text-gray-300">
                  {battleResult.rounds.length} rodadas • Batalha Completa
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`transition-all duration-300 ${
                hitTarget === battleResult.monster2.id ? "animate-pulse" : ""
              }`}
            >
              <div
                className={`${
                  hitTarget === battleResult.monster2.id
                    ? "ring-4 ring-red-500 ring-opacity-75 rounded-full"
                    : ""
                }`}
              >
                <StickFighter
                  monster={battleResult.monster2}
                  isAttacking={attackingMonster === battleResult.monster2.id}
                  isDefending={defendingMonster === battleResult.monster2.id}
                  position="right"
                  showProjectile={
                    showProjectile &&
                    attackingMonster === battleResult.monster2.id
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
          {currentRound < battleResult.rounds.length ? (
            <div className="flex items-center justify-center space-x-2 bg-black/80 rounded-full px-4 py-2">
              <div className="animate-spin text-yellow-400">⚡</div>
              <span className="text-white">LUTANDO...</span>
              <div className="animate-spin text-yellow-400">⚡</div>
            </div>
          ) : showResult ? (
            <button
              onClick={onClose}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-lg rounded-lg border-2 border-yellow-400 hover:scale-105 transition-all"
            >
              🎮 CONTINUAR
            </button>
          ) : (
            <div className="flex items-center justify-center space-x-2 bg-black/80 rounded-full px-4 py-2">
              <div className="animate-bounce text-yellow-400">🔮</div>
              <span className="text-white">CALCULANDO...</span>
              <div className="animate-bounce text-yellow-400">🔮</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
