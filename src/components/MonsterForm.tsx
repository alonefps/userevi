"use client";

import { useState, useEffect } from "react";
import { Monster } from "@/types/monster";

interface MonsterFormProps {
  onSubmit: (monster: Omit<Monster, "id" | "maxHp">) => void;
  onCancel: () => void;
}

export function MonsterForm({ onSubmit, onCancel }: MonsterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    attack: 80,
    defense: 40,
    speed: 60,
    hp: 250,
    imageUrl: "",
  });

  const [imageValidation, setImageValidation] = useState({
    isValid: false,
    isLoading: false,
    error: "",
  });

  const validateImageUrl = async (url: string) => {
    if (!url.trim()) {
      setImageValidation({ isValid: false, isLoading: false, error: "" });
      return;
    }

    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const hasValidExtension = imageExtensions.some((ext) =>
      url.toLowerCase().includes(ext)
    );

    if (!hasValidExtension) {
      setImageValidation({
        isValid: false,
        isLoading: false,
        error: "URL deve ter extensão de imagem (.jpg, .png, .gif, etc)",
      });
      return;
    }

    setImageValidation({ isValid: false, isLoading: true, error: "" });

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";

      const loadPromise = new Promise((resolve, reject) => {
        img.onload = () => resolve(true);
        img.onerror = () =>
          reject(new Error("Não foi possível carregar a imagem"));
        setTimeout(() => reject(new Error("Timeout ao carregar imagem")), 5000);
      });

      img.src = url;
      await loadPromise;

      setImageValidation({ isValid: true, isLoading: false, error: "" });
    } catch {
      setImageValidation({
        isValid: false,
        isLoading: false,
        error: "URL não é uma imagem válida ou não está acessível",
      });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.imageUrl) {
        validateImageUrl(formData.imageUrl);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.imageUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.name.trim() &&
      formData.imageUrl.trim() &&
      imageValidation.isValid
    ) {
      onSubmit(formData);
      setFormData({
        name: "",
        attack: 80,
        defense: 40,
        speed: 60,
        hp: 250,
        imageUrl: "",
      });
      setImageValidation({ isValid: false, isLoading: false, error: "" });
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getImageInputBorderColor = () => {
    if (!formData.imageUrl) return "border-slate-600";
    if (imageValidation.isLoading) return "border-yellow-400";
    if (imageValidation.isValid) return "border-green-400";
    if (imageValidation.error) return "border-red-400";
    return "border-slate-600";
  };

  const isFormValid =
    formData.name.trim() && formData.imageUrl.trim() && imageValidation.isValid;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 slide-in-up">
      <div className="glass-card rounded-3xl p-8 w-full max-w-2xl shadow-2xl">
        <h2 className="text-3xl font-black text-gradient mb-8 text-center">
          ✨ Criar Monstro
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-3 text-slate-300">
                Nome do Monstro
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-3 glass-card rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-slate-400 transition-all"
                placeholder="Digite o nome épico..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-3 text-slate-300">
                URL da Imagem
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    handleInputChange("imageUrl", e.target.value)
                  }
                  className={`w-full px-4 py-3 glass-card rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-slate-400 transition-all border-2 ${getImageInputBorderColor()}`}
                  placeholder="https://exemplo.com/avatar.jpg"
                  required
                />
                {imageValidation.isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                  </div>
                )}
                {imageValidation.isValid && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400">
                    ✓
                  </div>
                )}
                {imageValidation.error && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400">
                    ✗
                  </div>
                )}
              </div>
              {imageValidation.error && (
                <p className="text-red-400 text-xs mt-2">
                  {imageValidation.error}
                </p>
              )}
              {imageValidation.isValid && (
                <p className="text-green-400 text-xs mt-2">✓ Imagem válida</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="stat-card rounded-xl p-5">
              <label className="flex justify-between items-center mb-4">
                <span className="text-red-400 font-bold">⚔️ Ataque</span>
                <span className="text-white font-black text-xl">
                  {formData.attack}
                </span>
              </label>
              <input
                type="range"
                min="30"
                max="150"
                value={formData.attack}
                onChange={(e) =>
                  handleInputChange("attack", parseInt(e.target.value))
                }
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500 transition-all"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>30</span>
                <span>150</span>
              </div>
            </div>

            <div className="stat-card rounded-xl p-5">
              <label className="flex justify-between items-center mb-4">
                <span className="text-blue-400 font-bold">🛡️ Defesa</span>
                <span className="text-white font-black text-xl">
                  {formData.defense}
                </span>
              </label>
              <input
                type="range"
                min="10"
                max="80"
                value={formData.defense}
                onChange={(e) =>
                  handleInputChange("defense", parseInt(e.target.value))
                }
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-all"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>10</span>
                <span>80</span>
              </div>
            </div>

            <div className="stat-card rounded-xl p-5">
              <label className="flex justify-between items-center mb-4">
                <span className="text-yellow-400 font-bold">⚡ Velocidade</span>
                <span className="text-white font-black text-xl">
                  {formData.speed}
                </span>
              </label>
              <input
                type="range"
                min="20"
                max="120"
                value={formData.speed}
                onChange={(e) =>
                  handleInputChange("speed", parseInt(e.target.value))
                }
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 transition-all"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>20</span>
                <span>120</span>
              </div>
            </div>

            <div className="stat-card rounded-xl p-5">
              <label className="flex justify-between items-center mb-4">
                <span className="text-green-400 font-bold">❤️ HP</span>
                <span className="text-white font-black text-xl">
                  {formData.hp}
                </span>
              </label>
              <input
                type="range"
                min="150"
                max="400"
                value={formData.hp}
                onChange={(e) =>
                  handleInputChange("hp", parseInt(e.target.value))
                }
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500 transition-all"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>150</span>
                <span>400</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-4 glass-card rounded-xl text-white font-semibold hover:bg-slate-700/50 transition-all text-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all text-lg ${
                isFormValid
                  ? "neon-button text-white hover:shadow-lg"
                  : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
              }`}
            >
              Criar Monstro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
