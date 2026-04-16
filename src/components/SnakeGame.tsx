import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { Trophy, RefreshCw, Play } from 'lucide-react';

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout|null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection({ x: 0, y: -1 });
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (!isGameOver) setIsPaused(p => !p);
          else resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    const speed = Math.max(MIN_SPEED, INITIAL_SPEED - (score / 10) * SPEED_INCREMENT);
    timerRef.current = setInterval(moveSnake, speed);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [moveSnake, score]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.15)] max-w-xl w-full">
      <div className="flex justify-between w-full items-center mb-2">
        <div className="flex flex-col">
          <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">Score</span>
          <span className="text-4xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-yellow-400/80 mb-1">
            <Trophy size={14} />
            <span className="text-[10px] font-mono tracking-widest uppercase">Best</span>
          </div>
          <span className="text-xl font-bold text-white/60">{highScore}</span>
        </div>
      </div>

      <div 
        className="relative bg-neutral-900 border-4 border-cyan-500/50 rounded-xl overflow-hidden shadow-[inset_0_0_20px_rgba(6,182,212,0.3)]"
        style={{ 
          width: '320px', 
          height: '320px',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid lines for aesthetic */}
        <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-10 pointer-events-none">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-cyan-500" />
          ))}
        </div>

        {snake.map((segment, i) => (
          <div 
            key={i}
            className={`rounded-sm z-10 ${i === 0 ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-cyan-600/60'}`}
            style={{ 
              gridColumnStart: segment.x + 1, 
              gridRowStart: segment.y + 1 
            }}
          />
        ))}

        <div 
          className="bg-fuchsia-500 rounded-full shadow-[0_0_15px_#d946ef] z-10 animate-pulse"
          style={{ 
            gridColumnStart: food.x + 1, 
            gridRowStart: food.y + 1 
          }}
        />

        {(isPaused || isGameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center z-20 backdrop-blur-sm">
            {isGameOver ? (
              <>
                <h2 className="text-3xl font-black text-fuchsia-500 mb-2 uppercase tracking-tighter">System Failure</h2>
                <p className="text-white/60 text-sm mb-6 font-mono">Snake terminal disconnected.</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-6 py-3 rounded-full transition-all active:scale-95 shadow-[0_0_20px_rgba(217,70,239,0.4)]"
                >
                  <RefreshCw size={18} />
                  <span className="font-bold uppercase tracking-widest text-xs">Reboot</span>
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-black text-cyan-400 mb-2 uppercase tracking-tighter">System Paused</h2>
                <p className="text-white/60 text-sm mb-6 font-mono">Awaiting user input...</p>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-full transition-all active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  <Play size={18} fill="currentColor" />
                  <span className="font-bold uppercase tracking-widest text-xs">Resume</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 text-white/30 text-[10px] font-mono uppercase tracking-[0.2em]">
        <span>Arrows: Move</span>
        <span>•</span>
        <span>Space: Pause/Reset</span>
      </div>
    </div>
  );
};
