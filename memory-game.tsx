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
    25% { transform: translateX(20px) translateY(-10px) rotate(5deg); }
    50% { transform: translateX(-15px) translateY(15px) rotate(-3deg); }
    75% { transform: translateX(10px) translateY(-5px) rotate(2deg); }
    100% { transform: translateX(0) translateY(0) rotate(0deg); }
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
  const [isShuffling, setIsShuffling] = useState(false);
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
  }, []);

  // Handle card flip
  const flipCard = (cardId: number) => {
    if (!gameStarted) {
      startGame();
    }

    if (flippedCards.length === 2) return;
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return;
    if (isShuffling) return;

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
              setStats((prev) => ({
                ...prev,
                isComplete: true,
                isPlaying: false,
              }));

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 p-4 relative overflow-hidden">
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

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🧠 EthOS Faces
            </h1>
            <p className="text-gray-300 text-lg">Find matching pairs!</p>
            {isShuffling && (
              <p className="text-yellow-400 text-sm mt-2 animate-pulse">
                Shuffling cards...
              </p>
            )}
          </div>

          {/* Game Stats */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white border border-white/20">
              <div className="flex items-center gap-2">
                <MousePointer className="w-5 h-5" />
                <span className="font-semibold">{stats.moves} Moves</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white border border-white/20">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{formatTime(stats.time)}</span>
              </div>
            </div>
            {bestTime !== null && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white border border-white/20">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">
                    Best: {formatTime(bestTime)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Game Status */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {!gameStarted && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg">
                <span className="text-blue-300 font-medium">
                  Click any card to start playing!
                </span>
              </div>
            )}

            {gameStarted && stats.isPlaying && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg">
                <span className="text-green-300 font-medium">
                  Game in Progress
                </span>
              </div>
            )}

            {stats.isComplete && (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-lg">
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span className="text-yellow-300 font-medium">
                  Game Complete!
                </span>
              </div>
            )}
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto mb-8">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`aspect-square cursor-pointer perspective-1000 card-container ${
                  isShuffling ? "shuffle-animation" : ""
                }`}
                onClick={() => flipCard(card.id)}
                style={{
                  animationDelay: isShuffling ? `${card.id * 50}ms` : "0ms",
                }}
              >
                <div
                  className={`
                    relative w-full h-full transition-transform duration-700 transform-style-preserve-3d
                    ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""}
                    ${card.isMatched ? "match-pulse" : ""}
                    hover:scale-105
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
                    <div className="relative w-full h-full p-3">
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
                          ? "ring-4 ring-green-400 ring-opacity-60 bg-green-50"
                          : ""
                      }
                      flex items-center justify-center
                    `}
                  >
                    <div className="relative w-full h-full p-2">
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
          <div className="text-center mb-8">
            <Button
              onClick={initializeGame}
              disabled={isShuffling}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30 disabled:opacity-50 border"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {isShuffling ? "Shuffling..." : "New Game"}
            </Button>
          </div>

          {/* Win Modal */}
          {stats.isComplete && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
              <Card className="bg-white p-8 text-center max-w-sm w-full shadow-2xl">
                <div className="mb-4">
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    🎉 Congratulations!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    You completed the game successfully!
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Moves:</span>
                    <span className="font-semibold">{stats.moves}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold">
                      {formatTime(stats.time)}
                    </span>
                  </div>
                  {bestMoves === stats.moves && (
                    <div className="text-center text-green-600 font-medium">
                      🏆 New best moves record!
                    </div>
                  )}
                  {bestTime === stats.time && (
                    <div className="text-center text-green-600 font-medium">
                      ⚡ New best time record!
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={shareOnX}
                    className="w-full bg-black hover:bg-gray-800 text-white"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share on X
                  </Button>

                  <Button
                    onClick={initializeGame}
                    className="w-full bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
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
