"use client";

import { Monster } from "@/types/monster";
import Image from "next/image";

interface MonsterCardProps {
  monster: Monster;
  isSelected?: boolean;
  onClick?: () => void;
  showHp?: boolean;
  currentHp?: number;
}

export function MonsterCard({
  monster,
  isSelected,
  onClick,
  showHp = false,
  currentHp,
}: MonsterCardProps) {
  const hpPercentage =
    showHp && currentHp !== undefined
      ? (currentHp / monster.maxHp) * 100
      : (monster.hp / monster.maxHp) * 100;

  return (
    <div
      className={`
        relative group cursor-pointer transition-all duration-500 transform hover:scale-105 hover:-translate-y-2
        ${isSelected ? "scale-105 -translate-y-2" : ""}
      `}
      onClick={onClick}
    >
      <div
        className={`
          glass-card rounded-2xl p-6 transition-all duration-300
          ${
            isSelected
              ? "ring-2 ring-purple-400 shadow-2xl shadow-purple-500/30"
              : "hover:shadow-xl hover:shadow-blue-500/20"
          }
        `}
      >
        <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
          <Image
            src={monster.imageUrl}
            alt={monster.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {isSelected && (
            <div className="absolute inset-0 bg-purple-500/20 z-20 animate-pulse" />
          )}
        </div>

        <h3 className="text-xl font-bold text-gradient mb-4 text-center">
          {monster.name}
        </h3>

        {showHp && (
          <div className="mb-4">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-slate-300">HP</span>
              <span className="text-white">
                {currentHp !== undefined ? currentHp : monster.hp}/
                {monster.maxHp}
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div
                className="hp-bar rounded-full transition-all duration-500 ease-out"
                style={{ width: `${hpPercentage}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="stat-card rounded-xl p-3 text-center group/stat">
            <div className="text-red-400 font-bold text-sm mb-1">ATK</div>
            <div className="text-white font-black text-lg">
              {monster.attack}
            </div>
          </div>
          <div className="stat-card rounded-xl p-3 text-center group/stat">
            <div className="text-blue-400 font-bold text-sm mb-1">DEF</div>
            <div className="text-white font-black text-lg">
              {monster.defense}
            </div>
          </div>
          <div className="stat-card rounded-xl p-3 text-center group/stat">
            <div className="text-yellow-400 font-bold text-sm mb-1">SPD</div>
            <div className="text-white font-black text-lg">{monster.speed}</div>
          </div>
          <div className="stat-card rounded-xl p-3 text-center group/stat">
            <div className="text-green-400 font-bold text-sm mb-1">HP</div>
            <div className="text-white font-black text-lg">{monster.maxHp}</div>
          </div>
        </div>

        {isSelected && (
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 rounded-2xl -z-10 animate-pulse" />
        )}
      </div>
    </div>
  );
}
