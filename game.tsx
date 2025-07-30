import { useState, useEffect, useCallback } from "react";
import {
  RotateCcw,
  Trophy,
  Clock,
  MousePointer,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameStats {
  moves: number;
  time: number;
  isComplete: boolean;
  isPlaying: boolean;
}

const cardEmojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

export function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [stats, setStats] = useState<GameStats>({
    moves: 0,
    time: 0,
    isComplete: false,
    isPlaying: false,
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(
    localStorage.getItem("memoryGameBestTime")
      ? parseInt(localStorage.getItem("memoryGameBestTime")!)
      : null
  );
  const [bestMoves, setBestMoves] = useState<number | null>(
    localStorage.getItem("memoryGameBestMoves")
      ? parseInt(localStorage.getItem("memoryGameBestMoves")!)
      : null
  );

  // Initialize game
  const initializeGame = useCallback(() => {
    const duplicatedEmojis = [...cardEmojis, ...cardEmojis];
    const shuffledCards = duplicatedEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setStats({
      moves: 0,
      time: 0,
      isComplete: false,
      isPlaying: false,
    });
    setGameStarted(false);
    setShowWinDialog(false);
  }, []);

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setStats((prev) => ({ ...prev, isPlaying: true }));
  };

  // Reset game
  const resetGame = () => {
    initializeGame();
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

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (!gameStarted) {
      startGame();
    }

    if (flippedCards.length === 2) return;
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Flip the card
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setStats((prev) => ({ ...prev, moves: prev.moves + 1 }));

      const [firstCard, secondCard] = newFlippedCards;
      const firstEmoji = cards[firstCard].emoji;
      const secondEmoji = cards[secondCard].emoji;

      if (firstEmoji === secondEmoji) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              newFlippedCards.includes(card.id)
                ? { ...card, isMatched: true }
                : card
            )
          );
          setFlippedCards([]);

          // Check if game is complete
          const updatedCards = cards.map((card) =>
            newFlippedCards.includes(card.id)
              ? { ...card, isMatched: true }
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

            setShowWinDialog(true);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              newFlippedCards.includes(card.id)
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Memory Card Oyunu 🧠
          </h1>
          <p className="text-default-500">
            Aynı kartları eşleştirerek hafızanızı test edin!
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={resetGame} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Yeniden Başla
          </Button>
        </div>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-divider p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MousePointer className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-default-500">Hamle</p>
              <p className="text-xl font-semibold">{stats.moves}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-divider p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Clock className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-default-500">Süre</p>
              <p className="text-xl font-semibold">{formatTime(stats.time)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-divider p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Trophy className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-default-500">En İyi Süre</p>
              <p className="text-xl font-semibold">
                {bestTime ? formatTime(bestTime) : "--:--"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-divider p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-danger/10 rounded-lg">
              <MousePointer className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-sm text-default-500">En Az Hamle</p>
              <p className="text-xl font-semibold">
                {bestMoves ? bestMoves : "--"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Game Status */}
      <div className="flex items-center justify-center gap-4">
        {!gameStarted && (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
            <Play className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">
              Başlamak için herhangi bir karta tıklayın
            </span>
          </div>
        )}

        {gameStarted && stats.isPlaying && (
          <Badge
            variant="secondary"
            className="bg-success/10 text-success px-4 py-2"
          >
            <Play className="w-3 h-3 mr-1" />
            Oyun Devam Ediyor
          </Badge>
        )}

        {stats.isComplete && (
          <Badge
            variant="secondary"
            className="bg-warning/10 text-warning px-4 py-2"
          >
            <Trophy className="w-3 h-3 mr-1" />
            Oyun Tamamlandı!
          </Badge>
        )}
      </div>

      {/* Game Board */}
      <div className="flex justify-center">
        <div className="grid grid-cols-4 gap-3 p-6 bg-card rounded-lg border border-divider">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`
                relative w-16 h-16 md:w-20 md:h-20 cursor-pointer transition-all duration-300
                ${card.isMatched ? "scale-105" : "hover:scale-105"}
              `}
              onClick={() => handleCardClick(card.id)}
            >
              <div
                className={`
                  absolute inset-0 w-full h-full transition-transform duration-500 preserve-3d
                  ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""}
                `}
              >
                {/* Card Back */}
                <div
                  className={`
                    absolute inset-0 w-full h-full rounded-lg border-2 flex items-center justify-center
                    backface-hidden bg-primary text-primary-foreground font-bold text-lg
                    ${
                      !card.isFlipped && !card.isMatched
                        ? "shadow-lg hover:shadow-xl"
                        : ""
                    }
                  `}
                >
                  ?
                </div>

                {/* Card Front */}
                <div
                  className={`
                    absolute inset-0 w-full h-full rounded-lg border-2 flex items-center justify-center
                    backface-hidden rotate-y-180 text-4xl
                    ${
                      card.isMatched
                        ? "bg-success/20 border-success shadow-lg"
                        : "bg-card border-divider shadow-lg"
                    }
                  `}
                >
                  {card.emoji}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Instructions */}
      <div className="bg-gradient-to-r from-primary/5 to-success/5 rounded-lg border border-divider p-6">
        <h3 className="font-medium text-foreground mb-3">Nasıl Oynanır?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-default-600">
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium">
              1
            </span>
            <p>İki kart seçerek onları çevirin</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium">
              2
            </span>
            <p>Aynı emoji varsa kartlar açık kalır</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium">
              3
            </span>
            <p>Tüm çiftleri en az hamlede bulun</p>
          </div>
        </div>
      </div>

      {/* Win Dialog */}
      <Dialog open={showWinDialog} onOpenChange={setShowWinDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">🎉 Tebrikler! 🎉</DialogTitle>
            <DialogDescription className="text-center space-y-2">
              <p>Memory Card oyununu başarıyla tamamladınız!</p>
              <div className="bg-default-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Toplam Hamle:</span>
                  <span className="font-semibold">{stats.moves}</span>
                </div>
                <div className="flex justify-between">
                  <span>Toplam Süre:</span>
                  <span className="font-semibold">
                    {formatTime(stats.time)}
                  </span>
                </div>
                {bestMoves === stats.moves && (
                  <div className="text-center text-success font-medium">
                    🏆 Yeni en iyi hamle rekoru!
                  </div>
                )}
                {bestTime === stats.time && (
                  <div className="text-center text-success font-medium">
                    ⚡ Yeni en iyi süre rekoru!
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowWinDialog(false)}>
              Kapat
            </Button>
            <Button
              onClick={() => {
                resetGame();
                setShowWinDialog(false);
              }}
            >
              Tekrar Oyna
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
