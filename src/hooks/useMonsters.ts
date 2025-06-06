'use client';

import { useState, useEffect } from 'react';
import { Monster } from '@/types/monster';

const STORAGE_KEY = 'monster-battle-monsters';

export function useMonsters() {
  const [monsters, setMonsters] = useState<Monster[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setMonsters(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading monsters:', error);
      }
    }
  }, []);

  const saveMonsters = (newMonsters: Monster[]) => {
    setMonsters(newMonsters);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMonsters));
  };

  const addMonster = (monster: Omit<Monster, 'id' | 'maxHp'>) => {
    const newMonster: Monster = {
      ...monster,
      id: Date.now().toString(),
      maxHp: monster.hp
    };
    saveMonsters([...monsters, newMonster]);
  };

  const updateMonster = (id: string, updates: Partial<Monster>) => {
    const updatedMonsters = monsters.map(m =>
      m.id === id ? { ...m, ...updates } : m
    );
    saveMonsters(updatedMonsters);
  };

  const createDefaultMonsters = () => {
    const igorExists = monsters.some(m => m.name === "Igor Souza");
    const marceloExists = monsters.some(m => m.name === "Marcelo Miyachi");

    if (igorExists && marceloExists) {
      return;
    }

    const defaultMonsters = [];

    if (!igorExists) {
      defaultMonsters.push({
        id: `igor-${Date.now()}`,
        name: "Igor Souza",
        attack: 120,
        defense: 45,
        speed: 85,
        hp: 80,
        maxHp: 80,
        imageUrl: "https://github.com/alonefps.png",
      });
    }

    if (!marceloExists) {
      defaultMonsters.push({
        id: `marcelo-${Date.now() + 1}`,
        name: "Marcelo Miyachi",
        attack: 95,
        defense: 65,
        speed: 75,
        hp: 200,
        maxHp: 200,
        imageUrl: "https://media.licdn.com/dms/image/v2/C4E03AQFlIsZZoVLVPw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1552524877655?e=1754524800&v=beta&t=l0xEggfmeGVhEH317_lDjIYPiTYDkTEX6O5pj2BPQbg",
      });
    }

    if (defaultMonsters.length > 0) {
      saveMonsters([...monsters, ...defaultMonsters]);
    }
  };

  const deleteMonster = (id: string) => {
    saveMonsters(monsters.filter(m => m.id !== id));
  };

  return {
    monsters,
    addMonster,
    updateMonster,
    createDefaultMonsters,
    deleteMonster,
  };
}