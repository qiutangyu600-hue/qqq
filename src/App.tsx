/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Heart, 
  ChevronLeft, 
  User, 
  Wind, 
  CloudRain, 
  Bird, 
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Music
} from 'lucide-react';

// --- Types & Data ---

const NAV_ITEMS = [
  { id: 0, label: '首页 · 钢琴', icon: <Sparkles size={16} /> },
  { id: 1, label: '情绪星云', icon: <Wind size={16} /> },
  { id: 2, label: '呼吸引导', icon: <CloudRain size={16} /> },
  { id: 3, label: '艺术画廊', icon: <Bird size={16} /> },
  { id: 4, label: '疗愈报告', icon: <Sparkles size={16} /> },
  { id: 5, label: '提醒建议', icon: <Heart size={16} /> },
  { id: 6, label: '个人中心', icon: <User size={16} /> },
];

type Emotion = {
  id: string;
  name: string;
  quote: string;
  artUrl: string;
  color: string;
};

const EMOTIONS: Emotion[] = [
  { 
    id: 'tension', 
    name: '紧张', 
    quote: '让肩膀从耳朵旁边离开，让眉头松开，在这一刻，你是安全的。', 
    artUrl: 'https://picsum.photos/seed/calm-ocean/600/400',
    color: '#002FA7' // Klein Blue
  },
  { 
    id: 'sadness', 
    name: '悲伤', 
    quote: '你可以哭，可以沉默，可以做任何你想做的，只要你在。', 
    artUrl: 'https://picsum.photos/seed/soft-rain/600/400',
    color: '#0033CC'
  },
  { 
    id: 'confusion', 
    name: '茫然', 
    quote: '像种子在黑暗里等待春天，你不知道会开出什么花，但你正在生长。', 
    artUrl: 'https://picsum.photos/seed/misty-forest/600/400',
    color: '#001A66'
  },
  { 
    id: 'distress', 
    name: '困恼', 
    quote: '心里的线团乱了，就从最外面那一根开始。', 
    artUrl: 'https://picsum.photos/seed/abstract-lines/600/400',
    color: '#0040FF'
  },
  { 
    id: 'lonely', 
    name: '孤独', 
    quote: '孤独是生命的底色，也是灵魂最自由的时刻。', 
    artUrl: 'https://picsum.photos/seed/lonely-lighthouse/600/400',
    color: '#002FA7'
  },
  { 
    id: 'anxiety', 
    name: '焦虑', 
    quote: '焦虑是未来的投射，回到当下，感受脚下的土地。', 
    artUrl: 'https://picsum.photos/seed/anxiety-waves/600/400',
    color: '#0033CC'
  },
  { 
    id: 'fatigue', 
    name: '疲惫', 
    quote: '累了就停下来，休息不是放弃，而是为了更好的出发。', 
    artUrl: 'https://picsum.photos/seed/fatigue-sunset/600/400',
    color: '#001A66'
  },
];

type Artwork = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  subtitles: string[];
};

const ARTWORKS: Artwork[] = [
  {
    id: 'wind',
    title: '风的呼吸',
    category: '自然风景',
    imageUrl: 'https://picsum.photos/seed/windy-field/800/1200',
    description: '捕捉微风拂过麦田的瞬间，那是大地最轻柔的叹息。',
    subtitles: ['听，风在诉说', '带走所有的沉重', '只留下轻盈的灵魂']
  },
  {
    id: 'rain',
    title: '雨的呼吸',
    category: '自然风景',
    imageUrl: 'https://picsum.photos/seed/rainy-window/800/1200',
    description: '细雨敲打窗棂，洗涤尘埃，也洗涤那些无处安放的情绪。',
    subtitles: ['雨落的声音', '是时间的洗礼', '万物在静默中重生']
  },
  {
    id: 'animal',
    title: '动物的疗愈',
    category: '动物',
    imageUrl: 'https://picsum.photos/seed/sleeping-cat/800/1200',
    description: '生命最纯粹的律动，藏在每一次平稳的呼吸与宁静的睡眠中。',
    subtitles: ['纯真的眼眸', '无声的陪伴', '最温暖的力量']
  },
  {
    id: 'forest',
    title: '森林的低语',
    category: '自然风景',
    imageUrl: 'https://picsum.photos/seed/deep-forest/800/1200',
    description: '深呼吸，感受泥土与绿叶的气息，那是森林给你的拥抱。',
    subtitles: ['绿色的海洋', '光影的舞蹈', '找回迷失的自我']
  },
  {
    id: 'ocean',
    title: '深海的静谧',
    category: '自然风景',
    imageUrl: 'https://picsum.photos/seed/deep-sea/800/1200',
    description: '在深蓝的怀抱里，所有的喧嚣都化为无声的波纹。',
    subtitles: ['无尽的蔚蓝', '潮汐的节奏', '归于最初的平静']
  },
  {
    id: 'star',
    title: '星空的守望',
    category: '自然风景',
    imageUrl: 'https://picsum.photos/seed/night-sky/800/1200',
    description: '仰望星空，每一颗星都是一个温柔的承诺。',
    subtitles: ['璀璨的银河', '永恒的宁静', '你是宇宙的一部分']
  }
];

// --- Components ---

const PageWrapper = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
    className={`w-full h-full flex flex-col items-center justify-start md:justify-center p-4 md:p-12 relative overflow-y-auto overflow-x-hidden ${className}`}
  >
    <div className="w-full flex flex-col items-center py-10 md:py-0">
      {children}
    </div>
  </motion.div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [hoveredEmotion, setHoveredEmotion] = useState<Emotion | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resetApp = () => {
    setSelectedEmotions([]);
    setSelectedArtwork(null);
    setIsFlipped(false);
    setIsTransitioning(false);
    setRipples([]);
  };

  const nextPage = () => {
    if (currentPage < NAV_ITEMS.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      resetApp();
      setCurrentPage(0);
    }
  };
  const prevPage = () => setCurrentPage(prev => Math.max(0, prev - 1));

  const toggleEmotion = (id: string, e?: React.MouseEvent) => {
    if (isTransitioning) return;
    
    // Add ripple effect
    if (e) {
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== newRipple.id)), 1000);
    }

    setSelectedEmotions(prev => {
      if (prev.includes(id)) return prev.filter(e => e !== id);
      if (prev.length < 2) return [...prev, id];
      return prev;
    });
  };

  // Auto-transition when 2 emotions are selected
  useEffect(() => {
    if (selectedEmotions.length === 2 && !isTransitioning) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        nextPage();
        setIsTransitioning(false);
      }, 1200); 
      return () => clearTimeout(timer);
    }
  }, [selectedEmotions, isTransitioning]);

  const goToPage = (id: number) => {
    setCurrentPage(id);
    setIsNavOpen(false);
    setIsTransitioning(false);
  };

  // --- Scroll Navigation ---
  useEffect(() => {
    let lastScrollTime = 0;
    const scrollCooldown = 1200; // 1.2s cooldown between page transitions

    const handleWheel = (e: WheelEvent) => {
      // Don't scroll if in detail view, nav is open, or already transitioning
      if (selectedArtwork || isNavOpen || isTransitioning) return;

      const now = Date.now();
      if (now - lastScrollTime < scrollCooldown) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 40) return; // Threshold to prevent accidental scrolls

      if (delta > 0) {
        // Scroll Down
        if (currentPage < NAV_ITEMS.length - 1) {
          // Require emotions for nebula (page 1)
          if (currentPage === 0 && selectedEmotions.length < 2) return; 
          setCurrentPage(prev => prev + 1);
        } else {
          setCurrentPage(0); // Loop to start
        }
        lastScrollTime = now;
      } else if (delta < 0) {
        // Scroll Up
        if (currentPage > 0) {
          setCurrentPage(prev => prev - 1);
        } else {
          setCurrentPage(NAV_ITEMS.length - 1); // Loop to end
        }
        lastScrollTime = now;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentPage, isNavOpen, isTransitioning, selectedArtwork, selectedEmotions]);

  // --- Render Helpers ---

  const renderScrollbar = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-8 z-[100] hidden md:flex"
    >
      <div className="text-sm text-white/20 vertical-text tracking-[0.5em] uppercase mb-2">
        LEVEL SCROLL
      </div>
      
      <div className="relative flex flex-col items-center gap-4">
        {/* Progress Line */}
        <div className="absolute top-0 bottom-0 w-[1px] bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 w-full bg-[#002FA7] rounded-full shadow-[0_0_15px_#002FA7]"
            animate={{ 
              height: `${((currentPage) / (NAV_ITEMS.length - 1)) * 100}%`,
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          />
        </div>

        {/* Level Dots */}
        {NAV_ITEMS.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => goToPage(item.id)}
            whileHover={{ scale: 1.2 }}
            className="relative group"
          >
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 border border-white/20
              ${currentPage === item.id ? 'bg-[#002FA7] scale-150 shadow-[0_0_12px_#002FA7] border-transparent' : 'bg-white/10 group-hover:bg-white/40'}
            `} />
            
            {/* Label on Hover */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-sm border border-white/10 text-sm tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase">
              {item.label}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="text-sm text-white/20 mt-2">
        0{currentPage + 1}
      </div>
    </motion.div>
  );

  const renderNavigation = () => (
    <AnimatePresence>
      {isNavOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 left-0 w-full sm:w-80 bg-[#002FA7]/40 backdrop-blur-2xl text-white z-[60] shadow-2xl p-8 sm:p-12 flex flex-col border-r border-white/10"
        >
          <div className="flex justify-between items-center mb-16">
            <h3 className="text-base text-white/90 tracking-widest">目录 / INDEX</h3>
            <button onClick={() => setIsNavOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => goToPage(item.id)}
                whileHover={{ x: 10 }}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all text-left group
                  ${currentPage === item.id ? 'bg-white/20 text-white font-medium shadow-xl' : 'hover:bg-white/10 opacity-70 hover:opacity-100'}
                `}
              >
                <span className={`transition-transform group-hover:scale-110 text-white`}>
                  {item.icon}
                </span>
                <span className="text-base">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          <div className="mt-auto opacity-20 text-sm tracking-[0.3em] uppercase">
            Art Healing Book / Established 2024
          </div>
        </motion.div>
      )}
      {isNavOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsNavOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
        />
      )}
    </AnimatePresence>
  );

  const renderPiano = () => (
    <PageWrapper className="starry-bg text-white overflow-hidden">
      {/* Navigation Trigger */}
      <button 
        onClick={() => setIsNavOpen(true)}
        className="fixed top-4 left-4 md:top-8 md:left-8 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
      >
        <Menu size={24} />
      </button>

      {isTransitioning ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center z-10"
        >
          <Sparkles size={80} className="mx-auto text-blue-400 opacity-50 animate-pulse mb-12" />
          <h2 className="text-lg mb-6 tracking-[0.3em]">迷失在星海中</h2>
          <p className="text-base text-blue-300/60 italic">网络延迟，我好像睡着了。</p>
        </motion.div>
      ) : (
        <>
          {/* Click Ripples */}
          <AnimatePresence>
            {ripples.map(ripple => (
              <motion.div
                key={ripple.id}
                initial={{ opacity: 0.5, scale: 0 }}
                animate={{ opacity: 0, scale: 4 }}
                exit={{ opacity: 0 }}
                style={{ left: ripple.x - 20, top: ripple.y - 20 }}
                className="fixed w-10 h-10 border border-white rounded-full pointer-events-none z-[100]"
              />
            ))}
          </AnimatePresence>

          <div className="max-w-6xl w-full flex flex-col items-center gap-6 md:gap-16 relative">
            
            {/* Sheet Music Area - Enhanced with Texture and Depth */}
            <motion.div 
              className="w-full h-56 md:h-80 border-b-8 border-white/10 rounded-t-[30px] md:rounded-t-[40px] p-6 md:p-10 relative flex flex-col items-center justify-center bg-white/90 backdrop-blur-md shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden"
              style={{ 
                backgroundImage: 'linear-gradient(rgba(0,47,167,0.05) 1px, transparent 1px), radial-gradient(rgba(0,47,167,0.02) 15%, transparent 16%)', 
                backgroundSize: '100% 28px, 4px 4px' 
              }}
              animate={hoveredEmotion ? { scale: 1.01 } : { scale: 1 }}
            >
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
              
              {/* Treble Clef */}
              <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 opacity-[0.1] pointer-events-none text-[#002FA7]">
                <Music size={80} className="md:w-[140px] md:h-[140px]" strokeWidth={0.5} />
              </div>
              
              <div className="absolute inset-0 opacity-[0.15] pointer-events-none flex flex-col justify-center gap-3 md:gap-5 px-10 md:px-20">
                {[...Array(5)].map((_, i) => <div key={i} className="h-[1px] md:h-[1.5px] bg-[#002FA7] w-full" />)}
              </div>

              <AnimatePresence mode="wait">
                {hoveredEmotion ? (
                  <motion.div 
                    key={hoveredEmotion.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-10 text-center z-10"
                  >
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-[#002FA7]/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img 
                        src={hoveredEmotion.artUrl} 
                        alt={hoveredEmotion.name} 
                        className="w-48 h-32 md:w-72 md:h-44 object-cover rounded-sm shadow-2xl mb-4 md:mb-8 border-[4px] md:border-[8px] border-white relative z-10"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="text-sm md:text-base italic max-w-xl leading-relaxed text-[#002FA7] tracking-tight">
                      {hoveredEmotion.quote}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-10 text-center z-10"
                  >
                    <motion.h1 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="text-base md:text-lg mb-4 md:mb-6 tracking-tighter text-[#002FA7] drop-shadow-sm"
                    >
                      艺术疗愈书
                    </motion.h1>
                    <p className="text-[#002FA7]/40 italic text-sm md:text-base tracking-widest uppercase">轻触琴键 · 聆听心声</p>
                    <div className="mt-6 md:mt-10 flex flex-wrap justify-center gap-2 md:gap-4">
                      {selectedEmotions.map(id => (
                        <motion.span 
                          initial={{ scale: 0, y: 20 }} 
                          animate={{ scale: 1, y: 0 }} 
                          key={id} 
                          className="px-4 md:px-8 py-1 md:py-2 bg-[#002FA7] text-white rounded-full text-sm shadow-xl tracking-widest"
                        >
                          {EMOTIONS.find(e => e.id === id)?.name}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Piano Body & Keys - Polished Gloss Finish */}
            <div className="w-full overflow-x-auto pb-12 hide-scrollbar">
              <div className="inline-flex min-w-full justify-start md:justify-center px-6 md:px-4">
                <div className="relative bg-gradient-to-br from-[#2a2a2a] via-[#0a0a0a] to-[#000] p-4 md:p-8 rounded-[20px] md:rounded-[30px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.6)] border-t-[8px] md:border-t-[14px] border-[#3a3a3a] border-x-2 md:border-x-4 border-[#1a1a1a] before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/5 before:to-transparent before:rounded-[20px] md:before:rounded-[30px] before:pointer-events-none">
                  <div className="flex relative gap-0.5">
                    {[...Array(14)].map((_, i) => {
                      const emotion = EMOTIONS[i % EMOTIONS.length];
                      const isSelected = emotion && selectedEmotions.includes(emotion.id);
                      const isMultiSelected = selectedEmotions.length > 1;
                      
                      return (
                        <div key={i} className="relative group">
                          <motion.button
                            onMouseEnter={() => emotion && setHoveredEmotion(emotion)}
                            onMouseLeave={() => setHoveredEmotion(null)}
                            onClick={(e) => emotion && toggleEmotion(emotion.id, e)}
                            whileTap={{ y: 8, scaleY: 0.96 }}
                            animate={isSelected ? {
                              backgroundColor: isMultiSelected ? ["#ffffff", "#f0f7ff", "#ffffff"] : "#f8fbff",
                              scale: isMultiSelected ? [1, 1.01, 1] : 1,
                              boxShadow: isMultiSelected 
                                ? ["0 14px 0px #bbb", "0 14px 40px rgba(0,47,167,0.3)", "0 14px 0px #bbb"]
                                : "0 14px 0px #bbb"
                            } : {}}
                            transition={isMultiSelected ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                            className={`w-10 md:w-14 h-56 md:h-72 rounded-b-lg md:rounded-b-xl border-x border-gray-100 transition-all relative flex items-end justify-center pb-8 md:pb-12 shadow-[0_10px_0px_#ccc] md:shadow-[0_14px_0px_#ccc]
                              ${isSelected ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}
                              ${!emotion ? 'opacity-40 cursor-default' : 'cursor-pointer'}
                            `}
                          >
                            {/* Subtle Ripple Effect on Hover */}
                            {hoveredEmotion?.id === emotion?.id && (
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1.4, opacity: 0.15 }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                                className="absolute inset-0 bg-[#002FA7] rounded-b-lg md:rounded-b-xl pointer-events-none"
                              />
                            )}

                            {emotion && (
                              <span className={`text-sm vertical-text tracking-[0.2em] transition-all duration-500 ${isSelected ? 'text-[#002FA7] font-bold scale-110' : 'text-gray-300'}`}>
                                {emotion.name}
                              </span>
                            )}
                            {isSelected && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -top-10 md:-top-12"
                              >
                                <Sparkles size={20} className="md:w-7 md:h-7 text-[#002FA7] drop-shadow-[0_0_8px_rgba(0,47,167,0.4)]" />
                              </motion.div>
                            )}
                          </motion.button>

                          {/* Black Keys - With Highlight */}
                          {(i % 7) !== 2 && (i % 7) !== 6 && i < 13 && (
                            <motion.div 
                              whileHover={{ height: 170, brightness: 1.2 }}
                              className="absolute left-[72%] top-0 w-6 md:w-8 h-32 md:h-44 bg-gradient-to-b from-[#444] via-[#111] to-black rounded-b-md z-20 shadow-[4px_8px_15px_rgba(0,0,0,0.6)] md:shadow-[8px_15px_25px_rgba(0,0,0,0.6)] border-x border-gray-800 cursor-pointer overflow-hidden"
                            >
                              <div className="absolute top-0 left-1 w-1.5 md:w-2 h-full bg-white/5" />
                              <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 w-5 md:w-7 h-[1px] md:h-[1.5px] bg-white/10 rounded-full" />
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </PageWrapper>
  );

  const renderNebula = () => {
    const selectedEmotionsData = EMOTIONS.filter(e => selectedEmotions.includes(e.id));
    const isMobile = windowWidth < 768;
    
    return (
      <PageWrapper className="starry-bg text-white">
        {/* Navigation Trigger */}
        <button 
          onClick={() => setIsNavOpen(true)}
          className="fixed top-4 left-4 md:top-8 md:left-8 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
        >
          <Menu size={24} />
        </button>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{ 
                left: `${Math.random() * 100}%`, 
                top: `${Math.random() * 100}%` 
              }}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 2 + Math.random() * 3, 
                repeat: Infinity 
              }}
            />
          ))}
        </div>
        
        <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 60, repeat: Infinity, ease: "linear" }
            }}
            className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-br from-[#002FA7]/20 via-purple-900/10 to-transparent blur-[60px] md:blur-[100px] opacity-40"
          />

          <div className="relative w-full h-96 md:w-96 md:h-96 flex items-center justify-center">
            {/* Center Core */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)]"
            >
              <Sparkles className="text-white/50" size={24} />
            </motion.div>

            {/* Orbiting Emotion Spheres */}
            {selectedEmotionsData.map((emotion, index) => {
              const angle = (index / selectedEmotionsData.length) * Math.PI * 2;
              const radius = isMobile ? 100 : 160;
              
              return (
                <motion.div
                  key={emotion.id}
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20 + index * 5, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3 + index, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute"
                  style={{
                    width: isMobile ? '60px' : '80px',
                    height: isMobile ? '60px' : '80px',
                    transformOrigin: 'center center',
                  }}
                >
                  <motion.div
                    style={{
                      x: Math.cos(angle) * radius,
                      y: Math.sin(angle) * radius,
                    }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center p-2 md:p-4 text-center shadow-2xl group cursor-pointer hover:bg-white/20 transition-colors"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                    <span className="text-xs md:text-sm tracking-widest relative z-10">{emotion.name}</span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-16 md:mt-24 text-center px-6">
            <h2 className="text-base md:text-lg mb-4 tracking-widest">情绪星云</h2>
            <p className="text-blue-200 opacity-60 mb-8 md:mb-12 italic text-sm md:text-base">在这里，所有的感受都被温柔接纳</p>
            
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              onClick={nextPage}
              className="px-8 md:px-10 py-3 md:py-4 border border-white/20 rounded-full text-xs md:text-sm tracking-[0.3em] uppercase backdrop-blur-md transition-all flex items-center gap-3 mx-auto"
            >
              轻点一下，进入呼吸 <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>
      </PageWrapper>
    );
  };

  const renderBreathing = () => (
    <PageWrapper className="starry-bg text-white">
      {/* Navigation Trigger */}
      <button 
        onClick={() => setIsNavOpen(true)}
        className="fixed top-4 left-4 md:top-8 md:left-8 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
      >
        <Menu size={24} />
      </button>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-12 items-center z-10 px-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-white/20 p-2 mb-6 md:mb-8 bg-white/5 backdrop-blur-md">
            <img 
              src="https://picsum.photos/seed/water-ripple/400/400" 
              alt="Breathing" 
              className="w-full h-full object-cover rounded-full opacity-80"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="text-sm md:text-base mb-2 md:mb-4 tracking-widest">盒式呼吸法</h3>
          <p className="text-blue-200 opacity-60 italic text-sm md:text-base">如流水般自然，如微风般轻盈</p>
        </div>

        <div className="flex flex-col items-center justify-center h-64 md:h-96 relative">
          <motion.div
            animate={{ 
              scale: [1, 1.5, 1.5, 1, 1],
              borderRadius: ["20%", "50%", "50%", "20%", "20%"],
              rotate: [0, 0, 90, 90, 0]
            }}
            transition={{ 
              duration: 16, 
              repeat: Infinity,
              times: [0, 0.25, 0.5, 0.75, 1]
            }}
            className="w-32 h-32 md:w-48 md:h-48 bg-[#002FA7] opacity-20 absolute blur-2xl"
          />
          <div className="z-10 text-center">
            <motion.p
              key="status"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-base md:text-lg tracking-widest"
            >
              吸气...
            </motion.p>
          </div>
        </div>
      </div>

      <motion.button 
        whileHover={{ x: 10 }}
        onClick={nextPage}
        className="mt-12 md:fixed md:bottom-12 md:right-12 flex items-center gap-3 text-xs md:text-sm tracking-[0.3em] uppercase opacity-50 hover:opacity-100 transition-opacity z-10"
      >
        呼吸完毕，进入画廊 <ArrowRight size={18} />
      </motion.button>
    </PageWrapper>
  );

  const renderGallery = () => (
    <PageWrapper className="starry-bg text-white overflow-y-auto">
      {/* Navigation Trigger */}
      <button 
        onClick={() => setIsNavOpen(true)}
        className="fixed top-4 left-4 md:top-8 md:left-8 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
      >
        <Menu size={24} />
      </button>

      <div className="max-w-6xl w-full py-16 md:py-24 z-10 px-6">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-base md:text-lg mb-4 tracking-widest">艺术疗愈画廊</h2>
          <p className="text-blue-200 opacity-60 italic text-sm md:text-base">在色彩与线条中，找回宁静的自我</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
          {ARTWORKS.map((art) => (
            <motion.div
              key={art.id}
              whileHover={{ y: -15 }}
              onClick={() => setSelectedArtwork(art)}
              className="cursor-pointer group"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl mb-4 md:mb-6 shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-6 md:p-8">
                  <p className="text-sm tracking-widest uppercase">查看详情 / VIEW</p>
                </div>
                <img 
                  src={art.imageUrl} 
                  alt={art.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="text-base tracking-widest mb-1">{art.title}</h4>
              <p className="text-sm opacity-40 uppercase tracking-[0.3em]">{art.category}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 md:mt-24 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
            onClick={nextPage}
            className="px-10 md:px-16 py-4 md:py-5 border border-white/20 rounded-full text-sm md:text-base tracking-widest backdrop-blur-md hover:bg-white/10 transition-all"
          >
            查看我的疗愈报告
          </motion.button>
        </div>
      </div>
    </PageWrapper>
  );

  const renderArtDetail = () => {
    if (!selectedArtwork) return null;
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-[#000814] overflow-y-auto"
      >
        <div className="min-h-full w-full flex items-center justify-center relative">
          {/* Navigation Trigger */}
          <button 
            onClick={() => setIsNavOpen(true)}
            className="fixed top-4 left-4 md:top-8 md:left-8 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
          >
            <Menu size={24} />
          </button>

          <AnimatePresence mode="wait">
            {!isFlipped ? (
              <motion.div 
                key="front"
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="w-full min-h-screen relative flex flex-col items-center justify-center py-20"
              >
                <img 
                  src={selectedArtwork.imageUrl} 
                  alt={selectedArtwork.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                
                <div className="z-10 flex flex-col items-center text-center px-6">
                  <div className="mb-10 md:mb-16 space-y-4 md:space-y-6">
                    {selectedArtwork.subtitles.map((text, i) => (
                      <motion.p 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.5 }}
                        className="text-sm md:text-base text-white italic tracking-widest"
                      >
                        {text}
                      </motion.p>
                    ))}
                  </div>

                  <div className="flex gap-6 md:gap-10 items-center">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                    >
                      {isPlaying ? <Pause size={24} className="md:w-7 md:h-7" /> : <Play size={24} className="md:w-7 md:h-7" />}
                    </button>
                    <button className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                      <Heart size={24} className="md:w-7 md:h-7" />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedArtwork(null)}
                  className="absolute top-4 right-4 md:top-8 md:right-8 text-white flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity z-[80] uppercase tracking-[0.2em] text-xs md:text-sm"
                >
                  <ChevronLeft size={20} /> 返回画廊
                </button>

                <div className="absolute bottom-12 text-white text-sm opacity-30 tracking-[0.4em] uppercase animate-pulse">
                  长按作品查看简介 / LONG PRESS FOR INFO
                </div>
                
                <div 
                  className="absolute inset-0 cursor-help z-10"
                  onMouseDown={() => {
                    const timer = setTimeout(() => setIsFlipped(true), 800);
                    window.addEventListener('mouseup', () => clearTimeout(timer), { once: true });
                  }}
                  onTouchStart={() => {
                    const timer = setTimeout(() => setIsFlipped(true), 800);
                    window.addEventListener('touchend', () => clearTimeout(timer), { once: true });
                  }}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="back"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                onClick={() => setIsFlipped(false)}
                className="w-full min-h-screen bg-[#002FA7]/90 backdrop-blur-3xl text-white flex flex-col items-center justify-center p-8 md:p-12 text-center cursor-pointer"
              >
                <h3 className="text-lg mb-10 tracking-widest">{selectedArtwork.title}</h3>
                <p className="text-sm md:text-base leading-relaxed max-w-3xl opacity-80 italic">
                  {selectedArtwork.description}
                </p>
                <div className="mt-16 text-sm tracking-[0.5em] opacity-40 uppercase">点击返回作品 / CLICK TO RETURN</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  const renderReport = () => (
    <PageWrapper className="starry-bg text-white">
      {/* Navigation Trigger */}
      <button 
        onClick={() => setIsNavOpen(true)}
        className="fixed top-4 left-4 md:top-8 md:left-8 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
      >
        <Menu size={24} />
      </button>

      <div className="max-w-2xl w-full bg-white/5 backdrop-blur-2xl p-6 md:p-16 rounded-[30px] md:rounded-[40px] shadow-2xl border border-white/10 z-10 mx-6">
        <h2 className="text-base md:text-lg mb-8 md:mb-12 border-b border-white/10 pb-6 tracking-widest">疗愈反馈报告</h2>
        <div className="space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <span className="opacity-40 uppercase tracking-widest text-xs md:text-sm">记录时间 / TIME</span>
            <span className="italic text-sm md:text-base">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <span className="opacity-40 uppercase tracking-widest text-xs md:text-sm">初始心情 / MOOD</span>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {selectedEmotions.map(id => (
                <span key={id} className="px-3 md:px-4 py-1 bg-white/10 rounded-full text-xs md:text-sm tracking-widest">
                  {EMOTIONS.find(e => e.id === id)?.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <span className="opacity-40 uppercase tracking-widest text-xs md:text-sm">疗愈时长 / DURATION</span>
            <span className="italic text-sm md:text-base">12 分钟</span>
          </div>
          <div className="pt-8 md:pt-10 border-t border-white/10">
            <p className="text-sm md:text-base italic opacity-80 leading-relaxed">
              "你做得很好。现在带着这份平静，继续你的旅程。"
            </p>
          </div>
        </div>
      </div>
      <button 
        onClick={nextPage}
        className="mt-12 md:mt-16 flex items-center gap-3 text-xs md:text-sm tracking-[0.4em] uppercase opacity-50 hover:opacity-100 transition-opacity z-10"
      >
        轻点进入建议 <ChevronLeft size={16} className="rotate-180" />
      </button>
    </PageWrapper>
  );

  const renderSuggestions = () => (
    <PageWrapper className="starry-bg text-white">
      {/* Navigation Trigger */}
      <button 
        onClick={() => setIsNavOpen(true)}
        className="fixed top-4 left-4 md:top-8 md:left-8 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
      >
        <Menu size={24} />
      </button>

      <div className="max-w-4xl w-full text-center z-10 px-6">
        <h2 className="text-base md:text-lg mb-12 md:mb-20 tracking-[0.2em]">疗愈建议</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {[
            "喝一杯温水，感受温度流过身体",
            "轻轻动一动身体，伸个懒腰",
            "你比你以为的，更懂得照顾自己",
            "需要时，随时回来"
          ].map((text, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="p-8 md:p-10 border border-white/10 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all group"
            >
              <p className="text-sm md:text-base italic opacity-70 group-hover:opacity-100 transition-opacity">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.button 
        onClick={nextPage}
        className="mt-12 md:fixed md:bottom-12 md:right-12 flex items-center gap-3 text-xs md:text-sm tracking-[0.4em] uppercase opacity-50 hover:opacity-100 transition-opacity z-10"
      >
        进入我的页面 <ChevronLeft size={16} className="rotate-180" />
      </motion.button>
    </PageWrapper>
  );

  const renderProfile = () => (
    <PageWrapper className="starry-bg text-white">
      {/* Navigation Trigger */}
      <button 
        onClick={() => setIsNavOpen(true)}
        className="fixed top-4 left-4 md:top-8 md:left-8 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
      >
        <Menu size={24} />
      </button>

      <div className="max-w-md w-full flex flex-col items-center z-10 bg-white/5 backdrop-blur-2xl p-8 md:p-12 rounded-[30px] md:rounded-[40px] border border-white/10 shadow-2xl mx-6">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 flex items-center justify-center mb-6 md:mb-8 border border-white/20 shadow-inner">
          <User size={48} className="md:w-16 md:h-16 opacity-50" />
        </div>
        <h2 className="text-sm md:text-base mb-2 tracking-widest">疗愈旅人</h2>
        <p className="text-xs opacity-40 mb-8 md:mb-12 uppercase tracking-[0.3em]">已完成 15 次艺术疗愈</p>

        <div className="w-full space-y-4 md:space-y-6">
          <button className="w-full p-4 md:p-5 border border-white/10 rounded-xl md:rounded-2xl flex justify-between items-center hover:bg-white/10 transition-all group">
            <span className="text-sm md:text-base tracking-widest opacity-70 group-hover:opacity-100">我的收藏</span>
            <Heart size={18} className="opacity-40 group-hover:opacity-100" />
          </button>
          <button className="w-full p-4 md:p-5 border border-white/10 rounded-xl md:rounded-2xl flex justify-between items-center hover:bg-white/10 transition-all group">
            <span className="text-sm md:text-base tracking-widest opacity-70 group-hover:opacity-100">疗愈记录</span>
            <Sparkles size={18} className="opacity-40 group-hover:opacity-100" />
          </button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              resetApp();
              setCurrentPage(0);
            }}
            className="w-full p-4 md:p-5 bg-white text-[#002FA7] rounded-xl md:rounded-2xl flex justify-center items-center gap-3 text-sm md:text-base tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl"
          >
            重新开始旅程
          </motion.button>
        </div>
      </div>
    </PageWrapper>
  );

  const render404 = () => (
    <PageWrapper className="starry-bg text-white">
      <div className="text-center z-10 px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 md:mb-12"
        >
          <Sparkles size={60} className="md:w-20 md:h-20 mx-auto text-blue-400 opacity-50 animate-pulse" />
        </motion.div>
        <h2 className="text-base md:text-lg mb-4 md:mb-6 tracking-[0.3em]">迷失在星海中</h2>
        <p className="text-sm md:text-base opacity-60 mb-2 md:mb-4 italic">这片星空暂时还没有被探索...</p>
        <p className="text-sm md:text-base text-blue-300/60 mb-8 md:mb-12 italic">网络延迟，我好像睡着了。</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            resetApp();
            setCurrentPage(0);
          }}
          className="px-8 md:px-12 py-3 md:py-4 border border-white/20 rounded-full text-xs md:text-sm tracking-widest backdrop-blur-md hover:bg-white/10 transition-all"
        >
          返回现实世界
        </motion.button>
      </div>
    </PageWrapper>
  );

  return (
    <div className="w-full h-[100dvh] bg-white font-sans selection:bg-[#002FA7] selection:text-white overflow-hidden relative">
      {renderNavigation()}
      {renderScrollbar()}
      
      <AnimatePresence mode="popLayout">
        {currentPage === 0 && renderPiano()}
        {currentPage === 1 && renderNebula()}
        {currentPage === 2 && renderBreathing()}
        {currentPage === 3 && renderGallery()}
        {currentPage === 4 && renderReport()}
        {currentPage === 5 && renderSuggestions()}
        {currentPage === 6 && renderProfile()}
        {![0, 1, 2, 3, 4, 5, 6].includes(currentPage) && render404()}
      </AnimatePresence>

      <AnimatePresence>
        {selectedArtwork && renderArtDetail()}
      </AnimatePresence>
    </div>
  );
}
