import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2 } from 'lucide-react';
import { TRACKS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-sm bg-neutral-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex flex-col items-center gap-6">
        <div className="relative group">
          <motion.div 
            key={currentTrack.id}
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="w-48 h-48 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] border-2 border-white/5"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute -bottom-2 -right-2 bg-cyan-500 p-2 rounded-xl shadow-lg">
            <Music2 size={16} className="text-black" />
          </div>
        </div>

        <div className="text-center w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl font-black text-white tracking-tight truncate">{currentTrack.title}</h3>
              <p className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.3em] font-semibold">{currentTrack.artist}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full px-2">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          <div className="flex justify-between text-white/20 text-[10px] font-mono">
            <span>LIVE</span>
            <div className="flex items-center gap-1">
              <Volume2 size={10} />
              <span>AUTO</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 pb-2">
          <button 
            onClick={handlePrev}
            className="text-white/40 hover:text-cyan-400 transition-colors active:scale-90"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="text-white/40 hover:text-fuchsia-400 transition-colors active:scale-90"
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
