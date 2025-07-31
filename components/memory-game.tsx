"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, MousePointer, RotateCcw, Share, Trophy } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface GameCard {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameStats {
  moves: number;
  time: number;
  isComplete: boolean;
  isPlaying: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  life: number;
}

interface DollarParticle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

const gameImages = [
  "/images/logo-pink-teal.jpg",
  "/images/logo-purple-sad.jpg",
  "/images/logo-blue.jpg",
  "/images/logo-yellow-green.jpg",
  "/images/logo-blue-yellow.jpg",
  "/images/logo-orange-yellow.jpg",
  "/images/logo-orange-blue.jpg",
  "/images/logo-blue-angry.jpg",
];

const customStyles = `
  .perspective-1000 {
    perspective: 1000px;
  }
  
  .transform-style-preserve-3d {
    transform-style: preserve-3d;
  }
  
  .backface-hidden {
    backface-visibility: hidden;
  }
  
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
  
  .touch-manipulation {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  @keyframes cardFlip {
    0% { transform: rotateY(0deg) scale(1); }
    50% { transform: rotateY(90deg) scale(1.05); }
    100% { transform: rotateY(180deg) scale(1); }
  }
  
  @keyframes matchPulse {
    0% { transform: scale(1); }
    25% { transform: scale(1.1) rotate(2deg); }
    50% { transform: scale(1.05) rotate(-1deg); }
    75% { transform: scale(1.08) rotate(1deg); }
    100% { transform: scale(1.02); }
  }
  
  @keyframes matchGlow {
    0%, 100% { 
      box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
    }
    50% { 
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.6);
    }
  }
  
  @keyframes shuffle {
    0% { transform: translateX(0) translateY(0) rotate(0deg); }
    25% { transform: translateX(10px) translateY(-5px) rotate(3deg); }
    50% { transform: translateX(-8px) translateY(8px) rotate(-2deg); }
    75% { transform: translateX(5px) translateY(-3px) rotate(1deg); }
    100% { transform: translateX(0) translateY(0) rotate(0deg); }
  }
  
  @media (min-width: 640px) {
    @keyframes shuffle {
      0% { transform: translateX(0) translateY(0) rotate(0deg); }
      25% { transform: translateX(20px) translateY(-10px) rotate(5deg); }
      50% { transform: translateX(-15px) translateY(15px) rotate(-3deg); }
      75% { transform: translateX(10px) translateY(-5px) rotate(2deg); }
      100% { transform: translateX(0) translateY(0) rotate(0deg); }
    }
  }
  
  @keyframes particle {
    0% { 
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    100% { 
      transform: translateY(-100px) scale(0);
      opacity: 0;
    }
  }
  
  @keyframes confetti {
    0% { 
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% { 
      transform: translateY(-200px) rotate(720deg);
      opacity: 0;
    }
  }
  
  @keyframes dollarFall {
    0% { 
      transform: translateY(-100px) rotate(0deg);
      opacity: 1;
    }
    100% { 
      transform: translateY(calc(100vh + 100px)) rotate(360deg);
      opacity: 0;
    }
  }
  
  .card-flip-animation {
    animation: cardFlip 0.7s ease-in-out;
  }
  
  .match-pulse {
    animation: matchPulse 1.2s ease-in-out 1, matchGlow 2s ease-in-out infinite;
  }
  
  .shuffle-animation {
    animation: shuffle 0.8s ease-in-out;
  }
  
  .particle {
    position: absolute;
    pointer-events: none;
    border-radius: 50%;
    animation: particle 1s ease-out forwards;
  }
  
  .confetti {
    position: absolute;
    pointer-events: none;
    animation: confetti 2s ease-out forwards;
  }
  
  .dollar {
    position: fixed;
    pointer-events: none;
    font-size: 3rem;
    font-weight: bold;
    text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
    animation: dollarFall 4s linear forwards;
    z-index: 1000;
  }

  /* Mobile optimizations */
  @media (max-width: 640px) {
    .card-container {
      transition: transform 0.1s ease;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    .card-container:active {
      transform: scale(0.95);
    }
    
    * {
      -webkit-tap-highlight-color: transparent;
    }
  }
`;

export default function MemoryGame() {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [stats, setStats] = useState<GameStats>({
    moves: 0,
    time: 0,
    isComplete: false,
    isPlaying: false,
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dollarParticles, setDollarParticles] = useState<DollarParticle[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(
    typeof window !== "undefined" && localStorage.getItem("memoryGameBestTime")
      ? parseInt(localStorage.getItem("memoryGameBestTime")!)
      : null
  );
  const [bestMoves, setBestMoves] = useState<number | null>(
    typeof window !== "undefined" && localStorage.getItem("memoryGameBestMoves")
      ? parseInt(localStorage.getItem("memoryGameBestMoves")!)
      : null
  );

  // Initialize game
  const initializeGame = () => {
    setIsShuffling(true);

    // First, flip all cards back to show only the back side
    setCards((prev) =>
      prev.map((card) => ({ ...card, isFlipped: false, isMatched: false }))
    );
    setFlippedCards([]);

    setTimeout(() => {
      const shuffledImages = [...gameImages, ...gameImages]
        .sort(() => Math.random() - 0.5)
        .map((image, index) => ({
          id: index,
          image,
          isFlipped: false,
          isMatched: false,
        }));

      setCards(shuffledImages);
      setFlippedCards([]);
      setStats({
        moves: 0,
        time: 0,
        isComplete: false,
        isPlaying: false,
      });
      setGameStarted(false);
      setParticles([]);
      setIsShuffling(false);
    }, 1000);
  };

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setStats((prev) => ({ ...prev, isPlaying: true }));
  };

  // Play click sound
  const playClickSound = () => {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Create oscillator for bell/chime sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure sound (bell-like chime)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        600,
        audioContext.currentTime + 0.1
      );
      oscillator.frequency.exponentialRampToValueAtTime(
        400,
        audioContext.currentTime + 0.2
      );

      // Configure volume envelope (bell decay)
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.3,
        audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.4
      );

      // Play sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch (error) {
      // Silently fail if audio is not supported
      console.log("Audio not supported");
    }
  };

  // Play match sound
  const playMatchSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Create multiple oscillators for rich chime sound
      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      const osc3 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Connect nodes
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      osc3.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure frequencies (beautiful chime progression)
      osc1.frequency.setValueAtTime(523, audioContext.currentTime); // C5
      osc2.frequency.setValueAtTime(659, audioContext.currentTime); // E5
      osc3.frequency.setValueAtTime(784, audioContext.currentTime); // G5

      // Add slight detuning for richness
      osc1.frequency.exponentialRampToValueAtTime(
        520,
        audioContext.currentTime + 0.8
      );
      osc2.frequency.exponentialRampToValueAtTime(
        655,
        audioContext.currentTime + 0.8
      );
      osc3.frequency.exponentialRampToValueAtTime(
        780,
        audioContext.currentTime + 0.8
      );

      // Configure volume (long, beautiful decay)
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.25,
        audioContext.currentTime + 0.05
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 1.2
      );

      // Play sound
      osc1.start(audioContext.currentTime);
      osc2.start(audioContext.currentTime);
      osc3.start(audioContext.currentTime);
      osc1.stop(audioContext.currentTime + 1.2);
      osc2.stop(audioContext.currentTime + 1.2);
      osc3.stop(audioContext.currentTime + 1.2);
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  // Play victory sound
  const playVictorySound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Create triumphant fanfare melody
      const notes = [523, 659, 784, 1047, 1319]; // C5, E5, G5, C6, E6
      const timing = [0, 0.15, 0.3, 0.5, 0.7];

      notes.forEach((freq, index) => {
        // Create multiple oscillators for each note for richness
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        const osc3 = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        osc3.connect(gain);
        gain.connect(audioContext.destination);

        osc1.frequency.setValueAtTime(freq, audioContext.currentTime);
        osc2.frequency.setValueAtTime(freq * 1.5, audioContext.currentTime); // Fifth above
        osc3.frequency.setValueAtTime(freq * 0.5, audioContext.currentTime); // Octave below

        // Create crescendo effect
        const volume = 0.08 + index * 0.02; // Increasing volume
        gain.gain.setValueAtTime(0, audioContext.currentTime + timing[index]);
        gain.gain.linearRampToValueAtTime(
          volume,
          audioContext.currentTime + timing[index] + 0.08
        );
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          audioContext.currentTime + timing[index] + 0.6
        );

        osc1.start(audioContext.currentTime + timing[index]);
        osc2.start(audioContext.currentTime + timing[index]);
        osc3.start(audioContext.currentTime + timing[index]);
        osc1.stop(audioContext.currentTime + timing[index] + 0.6);
        osc2.stop(audioContext.currentTime + timing[index] + 0.6);
        osc3.stop(audioContext.currentTime + timing[index] + 0.6);
      });
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  // Play victory music
  const playVictoryMusic = () => {
    try {
      const audio = new Audio("/MONEY SONG - here comes the money [HQ].mp3");
      audio.volume = 0.7; // Set volume to 70%
      audio.play().catch((error) => {
        console.log("Could not play victory music:", error);
      });
    } catch (error) {
      console.log("Victory music not supported");
    }
  };

  // Create particles effect
  const createParticles = (x: number, y: number) => {
    const colors = [
      "#FFD700",
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
    ];
    const newParticles: Particle[] = [];
    const baseId = Date.now();

    for (let i = 0; i < 12; i++) {
      newParticles.push({
        id: baseId + i + Math.random() * 1000, // More unique ID generation
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocityX: (Math.random() - 0.5) * 200,
        velocityY: Math.random() * -150 - 50,
        life: 1,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
    }, 1000);
  };

  // Create dollar rain effect
  const createDollarRain = () => {
    const createBatch = () => {
      const newDollars: DollarParticle[] = [];
      const baseId = Date.now() + Math.random() * 10000;

      // Create 15 dollar bills falling from different positions
      for (let i = 0; i < 15; i++) {
        newDollars.push({
          id: baseId + i + Math.random() * 1000,
          x: Math.random() * window.innerWidth,
          y: -100,
          delay: Math.random() * 500, // Shorter delay between each dollar
        });
      }

      setDollarParticles((prev) => [...prev, ...newDollars]);

      // Remove this batch after animation
      setTimeout(() => {
        setDollarParticles((prev) =>
          prev.filter(
            (dollar) =>
              !newDollars.some((newDollar) => newDollar.id === dollar.id)
          )
        );
      }, 4500);
    };

    // Create multiple batches over time for continuous effect
    createBatch(); // First batch immediately

    const intervals: NodeJS.Timeout[] = [];
    for (let i = 1; i <= 8; i++) {
      const timeout = setTimeout(() => {
        createBatch();
      }, i * 800); // New batch every 800ms
      intervals.push(timeout);
    }

    // Clean up timeouts after 10 seconds
    setTimeout(() => {
      intervals.forEach(clearTimeout);
    }, 10000);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (stats.isPlaying && !stats.isComplete) {
      interval = setInterval(() => {
        setStats((prev) => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stats.isPlaying, stats.isComplete]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();

    // Check if user is on mobile device
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;

    if (isMobile) {
      setShowMobileWarning(true);
    }
  }, []);

  // Handle card flip
  const flipCard = (cardId: number) => {
    if (!gameStarted) {
      startGame();
    }

    // More comprehensive checks
    if (flippedCards.length >= 2) {
      return;
    }

    const targetCard = cards.find((card) => card.id === cardId);
    if (!targetCard) {
      return;
    }

    if (targetCard.isFlipped || targetCard.isMatched) {
      return;
    }

    if (isShuffling) {
      return;
    }

    // Play click sound
    playClickSound();

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update the cards state to flip the card immediately
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setStats((prev) => ({ ...prev, moves: prev.moves + 1 }));

      const [firstId, secondId] = newFlippedCards;

      // Use current cards state to check for matches
      setCards((currentCards) => {
        const firstCard = currentCards.find((card) => card.id === firstId);
        const secondCard = currentCards.find((card) => card.id === secondId);

        if (firstCard && secondCard && firstCard.image === secondCard.image) {
          // Match found - keep cards flipped and mark as matched
          playMatchSound(); // Play match sound immediately

          setTimeout(() => {
            setCards((prev) =>
              prev.map((card) =>
                card.id === firstId || card.id === secondId
                  ? { ...card, isMatched: true, isFlipped: true }
                  : card
              )
            );
            setFlippedCards([]);

            // Create particle effect at card positions
            const cardElements = document.querySelectorAll(".card-container");
            const firstCardElement = cardElements[firstId] as HTMLElement;
            const secondCardElement = cardElements[secondId] as HTMLElement;

            if (firstCardElement && secondCardElement) {
              const rect1 = firstCardElement.getBoundingClientRect();
              const rect2 = secondCardElement.getBoundingClientRect();

              createParticles(
                rect1.left + rect1.width / 2,
                rect1.top + rect1.height / 2
              );
              createParticles(
                rect2.left + rect2.width / 2,
                rect2.top + rect2.height / 2
              );
            }

            // Check if game is complete
            const updatedCards = currentCards.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true, isFlipped: true }
                : card
            );

            if (updatedCards.every((card) => card.isMatched)) {
              // Game complete
              playVictorySound(); // Play victory sound
              playVictoryMusic(); // Play victory music

              setStats((prev) => ({
                ...prev,
                isComplete: true,
                isPlaying: false,
              }));

              // Start dollar rain effect
              setTimeout(() => {
                createDollarRain();
              }, 1000);

              // Update best scores
              const currentTime = stats.time;
              const currentMoves = stats.moves + 1;

              if (typeof window !== "undefined") {
                if (!bestTime || currentTime < bestTime) {
                  setBestTime(currentTime);
                  localStorage.setItem(
                    "memoryGameBestTime",
                    currentTime.toString()
                  );
                }

                if (!bestMoves || currentMoves < bestMoves) {
                  setBestMoves(currentMoves);
                  localStorage.setItem(
                    "memoryGameBestMoves",
                    currentMoves.toString()
                  );
                }
              }

              // Create celebration particles
              setTimeout(() => {
                for (let i = 0; i < 50; i++) {
                  setTimeout(() => {
                    createParticles(
                      Math.random() * window.innerWidth,
                      (Math.random() * window.innerHeight) / 2
                    );
                  }, i * 100);
                }
              }, 500);
            }
          }, 1000);
        } else {
          // No match
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card) =>
                card.id === firstId || card.id === secondId
                  ? { ...card, isFlipped: false }
                  : card
              )
            );
            setFlippedCards([]);
          }, 1500);
        }

        return currentCards;
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Share on X (Twitter)
  const shareOnX = () => {
    const timeText =
      stats.time < 30 ? "under 30 seconds" : `${formatTime(stats.time)}`;
    const text = `Just completed EthOS Faces in ${timeText}! 🔥 Try it yourself while waiting for your code from @Ethereum_OS 👇\n\nlink: ${window.location.href}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <style jsx>{customStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 p-2 sm:p-4 relative overflow-hidden ">
        {/* Left Side Video */}

        {/* Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}

        {/* Dollar Rain */}
        {dollarParticles.map((dollar) => (
          <div
            key={dollar.id}
            className="dollar"
            style={{
              left: dollar.x,
              top: dollar.y,
              animationDelay: `${dollar.delay}ms`,
            }}
          >
            💵
          </div>
        ))}

        <div className="max-w-4xl mx-auto xl:px-52">
          {/* Ana içerik containerı - xl ekranlarında yan videoları için padding */}
          {/* Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">
              EthOS Faces
            </h1>
            <p className="text-gray-300 text-sm sm:text-lg">
              Find matching pairs!
            </p>
            {isShuffling && (
              <p className="text-yellow-400 text-xs sm:text-sm mt-2 animate-pulse">
                Shuffling cards...
              </p>
            )}
          </div>

          {/* Game Stats */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-6 mb-4 sm:mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1 sm:py-2 text-white border border-white/20">
              <div className="flex items-center gap-1 sm:gap-2">
                <MousePointer className="w-3 sm:w-5 h-3 sm:h-5" />
                <span className="font-semibold text-xs sm:text-base">
                  {stats.moves} Moves
                </span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1 sm:py-2 text-white border border-white/20">
              <div className="flex items-center gap-1 sm:gap-2">
                <Clock className="w-3 sm:w-5 h-3 sm:h-5" />
                <span className="font-semibold text-xs sm:text-base">
                  {formatTime(stats.time)}
                </span>
              </div>
            </div>
            {bestTime !== null && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1 sm:py-2 text-white border border-white/20">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Trophy className="w-3 sm:w-5 h-3 sm:h-5" />
                  <span className="font-semibold text-xs sm:text-base">
                    Best: {formatTime(bestTime)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Game Status */}
          <div className="flex items-center justify-center gap-4 mb-4 sm:mb-8">
            {!gameStarted && (
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500/20 rounded-lg">
                <span className="text-blue-300 font-medium text-xs sm:text-base text-center">
                  Click any card to start playing!
                </span>
              </div>
            )}

            {gameStarted && stats.isPlaying && (
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-500/20 rounded-lg">
                <span className="text-green-300 font-medium text-xs sm:text-base">
                  Game in Progress
                </span>
              </div>
            )}

            {stats.isComplete && (
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-yellow-500/20 rounded-lg">
                <Trophy className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-300" />
                <span className="text-yellow-300 font-medium text-xs sm:text-base">
                  Game Complete!
                </span>
              </div>
            )}
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-4 gap-1 sm:gap-3 max-w-xs sm:max-w-lg mx-auto mb-4 sm:mb-8 px-2 sm:px-0">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`aspect-square cursor-pointer perspective-1000 card-container ${
                  isShuffling ? "shuffle-animation" : ""
                } touch-manipulation`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  flipCard(card.id);
                }}
                style={{
                  animationDelay: isShuffling ? `${card.id * 50}ms` : "0ms",
                }}
              >
                <div
                  className={`
                    relative w-full h-full transition-transform duration-700 transform-style-preserve-3d
                    ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""}
                    ${card.isMatched ? "match-pulse" : ""}
                    hover:scale-105 active:scale-95
                  `}
                >
                  {/* Back of card (EthOS logo) */}
                  <Card
                    className={`
                      absolute inset-0 w-full h-full backface-hidden
                      bg-white shadow-lg border-2 border-gray-300
                      flex items-center justify-center
                      hover:shadow-xl transition-shadow duration-300
                    `}
                  >
                    <div className="relative w-full h-full p-2 sm:p-3">
                      <Image
                        src="/images/ethos-logo.jpg"
                        alt="EthOS Logo"
                        fill
                        className="object-contain"
                        crossOrigin="anonymous"
                      />
                    </div>
                  </Card>

                  {/* Front of card (game images) */}
                  <Card
                    className={`
                      absolute inset-0 w-full h-full backface-hidden rotate-y-180
                      bg-white shadow-xl border-2 border-blue-200
                      ${
                        card.isMatched
                          ? "ring-2 sm:ring-4 ring-green-400 ring-opacity-60 bg-green-50"
                          : ""
                      }
                      flex items-center justify-center
                    `}
                  >
                    <div className="relative w-full h-full p-1 sm:p-2">
                      <Image
                        src={card.image || "/placeholder.svg"}
                        alt="Memory card"
                        fill
                        className="object-contain rounded-md"
                        crossOrigin="anonymous"
                      />
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          {/* Reset Button */}
          <div className="text-center mb-4 sm:mb-8">
            <Button
              onClick={initializeGame}
              disabled={isShuffling}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30 disabled:opacity-50 border px-3 sm:px-4 py-2 text-xs sm:text-base "
            >
              <RotateCcw className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
              {isShuffling ? "Shuffling..." : "New Game"}
            </Button>

            {/* Test Button - Remove Later */}
            {/* <Button
              onClick={() => {
                createDollarRain();
                playVictoryMusic();
              }}
              className="bg-green-600 hover:bg-green-700 text-white border px-3 sm:px-4 py-2 text-xs sm:text-base"
            >
              💰 Test Dollar Rain
            </Button> */}
          </div>

          {/* Win Modal */}
          {stats.isComplete && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50">
              <Card className="bg-white p-4 sm:p-8 text-center max-w-xs sm:max-w-sm w-full shadow-2xl mx-2">
                <div className="mb-4">
                  <Trophy className="w-12 sm:w-16 h-12 sm:h-16 text-yellow-500 mx-auto mb-2 sm:mb-4 animate-bounce" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    🎉 Congratulations!
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    You completed the game successfully!
                  </p>
                </div>

                <div className="space-y-2 mb-4 sm:mb-6">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Moves:</span>
                    <span className="font-semibold">{stats.moves}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold">
                      {formatTime(stats.time)}
                    </span>
                  </div>
                  {bestMoves === stats.moves && (
                    <div className="text-center text-green-600 font-medium text-xs sm:text-sm">
                      🏆 New best moves record!
                    </div>
                  )}
                  {bestTime === stats.time && (
                    <div className="text-center text-green-600 font-medium text-xs sm:text-sm">
                      ⚡ New best time record!
                    </div>
                  )}
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Button
                    onClick={shareOnX}
                    className="w-full bg-black hover:bg-gray-800 text-white py-2 sm:py-3 text-xs sm:text-base"
                  >
                    <Share className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                    Share on X
                  </Button>

                  <Button
                    onClick={initializeGame}
                    className="w-full bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 sm:py-3 text-xs sm:text-base"
                  >
                    <RotateCcw className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                    Play Again
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Mobile Warning Modal */}
          {showMobileWarning && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
              <Card className="bg-white p-6 text-center max-w-sm w-full shadow-2xl mx-4">
                <div className="mb-6">
                  <div className="text-6xl mb-4">📱</div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    Mobile Device Detected
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    For the best gaming experience, we recommend playing EthOS
                    Faces on a desktop or laptop computer. The game is optimized
                    for larger screens and mouse/trackpad interaction.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setShowMobileWarning(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm font-medium"
                  >
                    Continue Anyway
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
