"use client";

import { useState } from "react";
import { Monster, BattleResult } from "@/types/monster";
import { useMonsters } from "@/hooks/useMonsters";
import { simulateBattle } from "@/utils/battle";
import { MonsterCard } from "@/components/MonsterCard";
import { MonsterForm } from "@/components/MonsterForm";

import { BattleViewer } from "@/components/BattleViewer";
import { BattleSelection } from "@/components/BattleSelection";

type ViewMode = "home" | "create" | "battle-select" | "battle-result";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const { monsters, addMonster, deleteMonster, createDefaultMonsters } =
    useMonsters();

  const handleCreateMonster = (monster: Omit<Monster, "id" | "maxHp">) => {
    addMonster(monster);
    setViewMode("home");
  };

  const handleBattleStart = (monster1: Monster, monster2: Monster) => {
    const result = simulateBattle(monster1, monster2);
    setBattleResult(result);
    setViewMode("battle-result");
  };

  const handleBattleClose = () => {
    setBattleResult(null);
    setViewMode("home");
  };

  return (
    <div className="min-h-screen content-overlay">
      <div className="max-w-7xl mx-auto p-6">
        <header className="text-center mb-12 slide-in-down">
          <h1 className="text-7xl font-black glow-text mb-6 tracking-tight">
            MONSTER ARENA
          </h1>
          <p className="text-2xl text-slate-300 mb-12 font-light">
            Crie monstros épicos e assista batalhas lendárias
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => setViewMode("create")}
              className="px-8 py-4 neon-button text-white rounded-xl font-semibold transition-all hover:shadow-lg text-lg"
            >
              ✨ Criar Monstro
            </button>
            <button
              onClick={createDefaultMonsters}
              className="px-8 py-4 button-gradient text-white rounded-xl font-semibold transition-all hover:shadow-lg text-lg"
            >
              🎮 Monstros Demo
            </button>
            <button
              onClick={() => setViewMode("battle-select")}
              disabled={monsters.length < 2}
              className={`px-8 py-4 rounded-xl font-semibold transition-all text-lg ${
                monsters.length >= 2
                  ? "neon-button text-white hover:shadow-lg"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              ⚔️ Iniciar Batalha
            </button>
          </div>
        </header>

        <main className="slide-in-up">
          {monsters.length === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center floating">
              <div className="text-6xl mb-8">⚔️</div>
              <h2 className="text-4xl font-bold text-gradient mb-6">
                Bem-vindo à Arena!
              </h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                A arena está vazia, guerreiro. Crie seu primeiro monstro e
                comece sua jornada épica!
              </p>
              <button
                onClick={() => setViewMode("create")}
                className="px-10 py-5 neon-button text-white rounded-xl font-semibold transition-all hover:shadow-lg text-xl"
              >
                Criar Primeiro Monstro
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-bold text-gradient">
                  Seus Monstros ({monsters.length})
                </h2>
                {monsters.length >= 2 && (
                  <div className="glass-card px-6 py-3 rounded-full pulse-glow">
                    <span className="text-cyan-400 font-semibold">
                      ⚡ Pronto para batalhar!
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {monsters.map((monster, index) => (
                  <div
                    key={monster.id}
                    className="relative group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <MonsterCard monster={monster} />
                    <button
                      onClick={() => deleteMonster(monster.id)}
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {viewMode === "create" && (
        <MonsterForm
          onSubmit={handleCreateMonster}
          onCancel={() => setViewMode("home")}
        />
      )}

      {viewMode === "battle-select" && (
        <BattleSelection
          monsters={monsters}
          onBattleStart={handleBattleStart}
          onCancel={() => setViewMode("home")}
        />
      )}

      {viewMode === "battle-result" && battleResult && (
        <BattleViewer battleResult={battleResult} onClose={handleBattleClose} />
      )}
    </div>
  );
}
