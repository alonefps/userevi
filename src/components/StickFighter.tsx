"use client";

import { Monster } from "@/types/monster";
import Image from "next/image";

interface StickFighterProps {
  monster: Monster;
  isAttacking?: boolean;
  isDefending?: boolean;
  position: "left" | "right";
  showProjectile?: boolean;
}

export function StickFighter({
  monster,
  isAttacking,
  isDefending,
  position,
  showProjectile = false,
}: StickFighterProps) {
  const isFlipped = position === "right";

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className={`${isFlipped ? "scale-x-[-1]" : ""}`}>
          <svg
            width="140"
            height="200"
            viewBox="0 0 140 200"
            className={`transition-all duration-300 ${
              isDefending ? "shake-animation" : ""
            }`}
          >
            <defs>
              <filter id={`glow-${monster.id}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle
              cx="70"
              cy="30"
              r="22"
              fill="none"
              stroke="#ff6b35"
              strokeWidth="4"
              filter={`url(#glow-${monster.id})`}
            />

            <line
              x1="70"
              y1="52"
              x2="70"
              y2="140"
              stroke="#4ecdc4"
              strokeWidth="5"
              filter={`url(#glow-${monster.id})`}
            />

            <line
              x1="70"
              y1="80"
              x2={isAttacking ? "105" : "100"}
              y2={isAttacking ? "70" : "75"}
              stroke="#ffe66d"
              strokeWidth="4"
              filter={`url(#glow-${monster.id})`}
              className={
                isAttacking ? "attack-animation" : "transition-all duration-300"
              }
            />

            <line
              x1="70"
              y1="90"
              x2="40"
              y2="100"
              stroke="#ffe66d"
              strokeWidth="4"
              filter={`url(#glow-${monster.id})`}
            />

            <line
              x1="70"
              y1="140"
              x2="45"
              y2="185"
              stroke="#ff4757"
              strokeWidth="4"
              filter={`url(#glow-${monster.id})`}
            />

            <line
              x1="70"
              y1="140"
              x2="95"
              y2="185"
              stroke="#ff4757"
              strokeWidth="4"
              filter={`url(#glow-${monster.id})`}
            />

            <circle
              cx={isAttacking ? "105" : "100"}
              cy={isAttacking ? "70" : "75"}
              r="8"
              fill="#2ed573"
              filter={`url(#glow-${monster.id})`}
              className={isAttacking ? "animate-pulse" : ""}
            />

            <rect
              x={isAttacking ? "97" : "92"}
              y={isAttacking ? "67" : "72"}
              width="4"
              height="18"
              fill="#666"
              filter={`url(#glow-${monster.id})`}
            />
          </svg>

          <div
            className={`absolute top-2 left-1/2 transform -translate-x-1/2 w-11 h-11 rounded-full overflow-hidden border-3 border-orange-400 ${
              isFlipped ? "scale-x-[-1]" : ""
            } ${isDefending ? "flash-animation" : ""}`}
            style={{
              boxShadow: "0 0 15px rgba(255, 107, 53, 0.8)",
            }}
          >
            <Image
              src={monster.imageUrl}
              alt={monster.name}
              width={44}
              height={44}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {showProjectile && (
          <div
            className={`absolute top-20 ${
              isFlipped ? "right-0" : "left-0"
            } w-full h-full pointer-events-none z-20`}
          >
            <div
              className={`absolute w-6 h-6 bg-yellow-400 rounded-full animate-pulse shadow-lg`}
              style={{
                left: isFlipped ? "auto" : "100px",
                right: isFlipped ? "100px" : "auto",
                top: "55px",
                boxShadow: "0 0 20px #ffe66d, 0 0 40px #ffe66d",
                animation: isFlipped
                  ? "projectile-left 0.6s ease-out"
                  : "projectile-right 0.6s ease-out",
              }}
            />
          </div>
        )}
      </div>

      <div className="text-center">
        <h3 className="text-xl font-bold text-yellow-400 glow-text mb-2">
          {monster.name.toUpperCase()}
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-red-500/30 rounded px-2 py-1">
            <div className="text-red-400 font-semibold">ATK</div>
            <div className="text-white font-bold text-sm">{monster.attack}</div>
          </div>
          <div className="bg-blue-500/30 rounded px-2 py-1">
            <div className="text-blue-400 font-semibold">DEF</div>
            <div className="text-white font-bold text-sm">
              {monster.defense}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
