/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { NeonBackground } from './components/NeonBackground';

export default function App() {
  return (
    <div className="min-h-screen text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <NeonBackground />
      
      <main className="container mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col items-center justify-center gap-12">
        {/* Header section */}
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500" />
            <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.5em] font-bold">Terminal 01</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            Neon <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">Beats</span>
          </h1>
          <p className="max-w-md mx-auto text-white/40 text-sm font-medium leading-relaxed">
            Synchronize your rhythm. Command the terminal.
          </p>
        </header>

        {/* Main Interface Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-12 max-w-7xl">
          
          {/* Left: Music Info / Decorative */}
          <div className="hidden lg:flex flex-col gap-8 order-1">
            <div className="space-y-4">
              <h4 className="font-mono text-[10px] text-fuchsia-400 uppercase tracking-widest border-l-2 border-fuchsia-500 pl-4 py-1">Mission Log</h4>
              <p className="text-sm text-white/50 leading-relaxed font-mono italic">
                {">"} Signal intensity: 98%<br/>
                {">"} Buffer status: Optimal<br/>
                {">"} Neural link: Established
              </p>
            </div>
            
            <div className="p-6 border border-white/5 bg-white/[0.02] rounded-3xl space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-widest text-white/60">Global Network</h5>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500/40" style={{ width: `${Math.random() * 80 + 20}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center: The Game */}
          <div className="order-2 lg:order-2 flex justify-center">
            <SnakeGame />
          </div>

          {/* Right: The Music Player */}
          <div className="order-3 lg:order-3 flex justify-center">
            <MusicPlayer />
          </div>
        </div>

        {/* Footer micro-details */}
        <footer className="mt-auto pt-8 flex flex-col items-center gap-4 border-t border-white/5 w-full max-w-lg">
          <div className="flex gap-8 text-white/20 font-mono text-[10px] uppercase tracking-widest">
            <span>© 2024 CYBER_OS</span>
            <span>V.4.0.2</span>
            <span>SECURE_LINK</span>
          </div>
        </footer>
      </main>

      <style>{`
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        body {
          cursor: crosshair;
        }
      `}</style>
    </div>
  );
}

