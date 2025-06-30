"use client";

import { useEffect, useState } from "react";

interface AnimatedSymbol {
  id: number;
  symbol: "X" | "O" | "Δ";
  x: number;
  y: number;
  size: number;
  color: string;
  animation: string;
  duration: number;
  delay: number;
}

export default function AnimatedBackground() {
  const [symbols, setSymbols] = useState<AnimatedSymbol[]>([]);

  useEffect(() => {
    const generateSymbols = () => {
      const newSymbols: AnimatedSymbol[] = [];
      const symbolTypes: ("X" | "O" | "Δ")[] = ["X", "O", "Δ"];
      const colors = [
        "text-blue-400/30 dark:text-blue-300/20",
        "text-red-400/30 dark:text-red-300/20",
        "text-green-400/30 dark:text-green-300/20",
        "text-purple-400/30 dark:text-purple-300/20",
        "text-cyan-400/30 dark:text-cyan-300/20",
        "text-orange-400/30 dark:text-orange-300/20",
      ];
      const animations = [
        "float-animation",
        "float-slow-animation",
        "glitch-animation",
        "pulse-glow-animation",
        "wiggle-animation",
      ];

      // Generate 15-20 symbols
      for (let i = 0; i < 18; i++) {
        newSymbols.push({
          id: i,
          symbol: symbolTypes[Math.floor(Math.random() * symbolTypes.length)],
          x: Math.random() * 100, // percentage
          y: Math.random() * 100, // percentage
          size: Math.random() * 40 + 20, // 20-60px
          color: colors[Math.floor(Math.random() * colors.length)],
          animation: animations[Math.floor(Math.random() * animations.length)],
          duration: Math.random() * 4 + 3, // 3-7 seconds
          delay: Math.random() * 2, // 0-2 seconds
        });
      }

      setSymbols(newSymbols);
    };

    generateSymbols();

    // Regenerate symbols periodically for variety
    const interval = setInterval(() => {
      generateSymbols();
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {symbols.map((symbol) => (
        <div
          key={symbol.id}
          className={`absolute select-none font-bold ${symbol.color} ${symbol.animation} transition-opacity duration-1000`}
          style={{
            left: `${symbol.x}%`,
            top: `${symbol.y}%`,
            fontSize: `${symbol.size}px`,
            animationDuration: `${symbol.duration}s`,
            animationDelay: `${symbol.delay}s`,
          }}
        >
          {symbol.symbol}
        </div>
      ))}

      {/* Additional glitch effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-transparent dark:via-emerald-500/5 animate-pulse" />

      {/* Floating particles */}
      <div
        className="absolute top-10 left-10 w-2 h-2 bg-blue-400/20 rounded-full bounce-in-animation"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute top-1/4 right-20 w-3 h-3 bg-red-400/20 rounded-full bounce-in-animation"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-green-400/20 rounded-full bounce-in-animation"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute bottom-20 right-1/3 w-4 h-4 bg-purple-400/20 rounded-full bounce-in-animation"
        style={{ animationDelay: "2s" }}
      />
    </div>
  );
}
