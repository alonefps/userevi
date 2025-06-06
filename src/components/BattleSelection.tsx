"use client";

import { useState } from "react";
import { Monster } from "@/types/monster";
import Image from "next/image";

interface BattleSelectionProps {
  monsters: Monster[];
  onBattleStart: (monster1: Monster, monster2: Monster) => void;
  onCancel: () => void;
}

export function BattleSelection({
  monsters,
  onBattleStart,
  onCancel,
}: BattleSelectionProps) {
  const [selectedMonsters, setSelectedMonsters] = useState<Monster[]>([]);

  const handleMonsterSelect = (monster: Monster) => {
    if (selectedMonsters.includes(monster)) {
      setSelectedMonsters(selectedMonsters.filter((m) => m.id !== monster.id));
    } else if (selectedMonsters.length < 2) {
      setSelectedMonsters([...selectedMonsters, monster]);
    }
  };

  const handleBattleStart = () => {
    if (selectedMonsters.length === 2) {
      onBattleStart(selectedMonsters[0], selectedMonsters[1]);
    }
  };

  const getPlayerNumber = (monster: Monster) => {
    const index = selectedMonsters.findIndex((m) => m.id === monster.id);
    return index === 0 ? 1 : index === 1 ? 2 : null;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-black overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 border-4 border-white rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 border-4 border-white rotate-45"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-8 border-white rounded-full"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="text-center py-8">
          <h1 className="text-6xl font-black text-white mb-2 tracking-wider">
            SELECIONE
          </h1>
          <h2 className="text-4xl font-black text-gradient mb-6">
            SEU MONSTRO
          </h2>

          <div className="flex justify-center items-center gap-8 mb-4">
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${
                selectedMonsters.length >= 1
                  ? "bg-blue-500/30 border-2 border-blue-400"
                  : "bg-gray-700/30 border-2 border-gray-600"
              }`}
            >
              <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
              <span className="text-white font-bold">JOGADOR 1</span>
              {selectedMonsters[0] && (
                <span className="text-blue-300 text-sm">
                  {selectedMonsters[0].name}
                </span>
              )}
            </div>

            <div className="text-white text-2xl font-bold">VS</div>

            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${
                selectedMonsters.length >= 2
                  ? "bg-red-500/30 border-2 border-red-400"
                  : "bg-gray-700/30 border-2 border-gray-600"
              }`}
            >
              <div className="w-4 h-4 bg-red-400 rounded-full"></div>
              <span className="text-white font-bold">JOGADOR 2</span>
              {selectedMonsters[1] && (
                <span className="text-red-300 text-sm">
                  {selectedMonsters[1].name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8">
          {monsters.length === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center">
              <div className="text-6xl mb-8">🏟️</div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Nenhum Monstro Disponível
              </h3>
              <p className="text-xl text-gray-300">
                Crie alguns monstros primeiro para começar a lutar!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-7xl">
              {monsters.map((monster, index) => {
                const isSelected = selectedMonsters.includes(monster);
                const playerNumber = getPlayerNumber(monster);

                return (
                  <div
                    key={monster.id}
                    className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 slide-in-up`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => handleMonsterSelect(monster)}
                  >
                    <div
                      className={`
                      relative w-24 h-24 rounded-xl overflow-hidden border-4 transition-all duration-300
                      ${
                        isSelected
                          ? playerNumber === 1
                            ? "border-blue-400 shadow-lg shadow-blue-500/50"
                            : "border-red-400 shadow-lg shadow-red-500/50"
                          : "border-gray-600 hover:border-white group-hover:shadow-lg group-hover:shadow-white/30"
                      }
                    `}
                    >
                      <Image
                        src={monster.imageUrl}
                        alt={monster.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="96px"
                      />

                      {!isSelected && (
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                      )}

                      {isSelected && playerNumber && (
                        <div
                          className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            playerNumber === 1 ? "bg-blue-500" : "bg-red-500"
                          }`}
                        >
                          {playerNumber}P
                        </div>
                      )}

                      {isSelected && (
                        <div
                          className={`absolute inset-0 rounded-xl ${
                            playerNumber === 1
                              ? "ring-4 ring-blue-400 ring-opacity-75"
                              : "ring-4 ring-red-400 ring-opacity-75"
                          } animate-pulse`}
                        ></div>
                      )}
                    </div>

                    <div className="mt-2 text-center">
                      <p
                        className={`text-xs font-bold truncate transition-colors duration-300 ${
                          isSelected
                            ? playerNumber === 1
                              ? "text-blue-300"
                              : "text-red-300"
                            : "text-gray-300 group-hover:text-white"
                        }`}
                      >
                        {monster.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="flex justify-center items-center gap-6">
            <button
              onClick={onCancel}
              className="px-8 py-4 bg-gray-700/50 backdrop-blur-sm border-2 border-gray-600 text-white rounded-xl font-bold text-lg hover:bg-gray-600/50 hover:border-gray-500 transition-all duration-300"
            >
              ← VOLTAR
            </button>

            <div className="text-center">
              <div className="text-white text-sm mb-1">
                {selectedMonsters.length}/2 Selecionados
              </div>
              {selectedMonsters.length === 2 && (
                <div className="text-yellow-400 text-sm font-bold animate-pulse">
                  Pronto para Lutar!
                </div>
              )}
            </div>

            <button
              onClick={handleBattleStart}
              disabled={selectedMonsters.length !== 2}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                selectedMonsters.length === 2
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-2 border-yellow-400 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/50 pulse-glow"
                  : "bg-gray-700/50 backdrop-blur-sm border-2 border-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              LUTAR! →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
