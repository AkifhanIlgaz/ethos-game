"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import HangmanDrawing from "./hangman-drawing";
const WORDS_AND_DEFINITIONS = [
  {
    word: "ROLLUP",
    definition:
      "A scaling solution that processes transactions off-chain and posts data on-chain.",
  },
  {
    word: "STAKING",
    definition:
      "Locking up tokens to support network operations like block validation in proof-of-stake.",
  },
  {
    word: "GAS",
    definition:
      "A fee paid to perform a transaction or execute a smart contract on Ethereum.",
  },
  {
    word: "SMARTCONTRACT",
    definition:
      "A self-executing contract with terms directly written into code.",
  },
  {
    word: "WALLET",
    definition:
      "A digital tool to store and manage your cryptocurrencies and private keys.",
  },
  {
    word: "METAMASK",
    definition:
      "A popular Ethereum wallet browser extension for interacting with dApps.",
  },
  {
    word: "LAYER2",
    definition:
      "Solutions built on top of Ethereum to increase scalability and reduce costs.",
  },
  {
    word: "DAPP",
    definition:
      "A decentralized application running on a blockchain network.",
  },
  {
    word: "ERC20",
    definition:
      "The standard for fungible tokens on the Ethereum blockchain.",
  },
  {
    word: "NFT",
    definition:
      "A non-fungible token representing unique digital ownership.",
  },
  {
    word: "VALIDATOR",
    definition:
      "A participant in proof-of-stake networks responsible for validating transactions and blocks.",
  },
  {
    word: "SOLIDITY",
    definition:
      "The main programming language used to write Ethereum smart contracts.",
  },
  {
    word: "ETHEREUM",
    definition:
      "A decentralized platform enabling smart contracts and dApps to run without downtime or fraud.",
  },
  {
    word: "HARDHAT",
    definition:
      "A development environment for compiling, testing, and deploying Ethereum smart contracts.",
  },
  {
    word: "WEB3",
    definition:
      "A new iteration of the internet focused on decentralization, blockchain, and user ownership.",
  },
  {
    word: "HASH",
    definition:
      "A fixed-length string generated from data, used in blockchain for security and integrity.",
  },
  {
    word: "MINER",
    definition:
      "A participant that uses computational power to validate transactions and secure proof-of-work blockchains.",
  },
  {
    word: "FORK",
    definition:
      "A change to a blockchain protocol that may create a separate version of the chain.",
  },
  {
    word: "NODE",
    definition:
      "A computer that participates in the blockchain network by maintaining a copy of the ledger.",
  },
  {
    word: "DEFI",
    definition:
      "Decentralized finance — financial services built on blockchain without intermediaries.",
  }
];



const MAX_WRONG_GUESSES = 6;

export default function HangmanGame() {
  const [currentWordData, setCurrentWordData] = useState(
    WORDS_AND_DEFINITIONS[Math.floor(Math.random() * WORDS_AND_DEFINITIONS.length)]
  );
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [showDefinition, setShowDefinition] = useState(false);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const displayWord = currentWordData.word
    .split("")
    .map((letter) => (guessedLetters.has(letter) ? letter : "_"))
    .join(" ");

  const isWordComplete = currentWordData.word
    .split("")
    .every((letter) => guessedLetters.has(letter));

  useEffect(() => {
    if (gameStatus === "playing") {
      if (isWordComplete) {
        setGameStatus("won");
        setShowDefinition(true);
      } else if (wrongGuesses >= MAX_WRONG_GUESSES) {
        setGameStatus("lost");
        setShowDefinition(true);
      }
    }
  }, [isWordComplete, wrongGuesses, gameStatus]);

  const handleLetterGuess = (letter: string) => {
    if (guessedLetters.has(letter) || gameStatus !== "playing") return;

    const newGuessedLetters = new Set(guessedLetters);
    newGuessedLetters.add(letter);
    setGuessedLetters(newGuessedLetters);

    if (!currentWordData.word.includes(letter)) {
      setWrongGuesses((prev) => prev + 1);
    }
  };

  const startNewGame = () => {
    const randomWord =
      WORDS_AND_DEFINITIONS[
        Math.floor(Math.random() * WORDS_AND_DEFINITIONS.length)
      ];
    setCurrentWordData(randomWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameStatus("playing");
    setShowDefinition(false);
  };

  const getHangmanDrawing = () => {
    const parts = [
      "  ┌─────┐",
      "  │     │",
      "  │     " + (wrongGuesses > 0 ? "😵" : " "),
      "  │    " +
        (wrongGuesses > 2 ? "/" : " ") +
        (wrongGuesses > 1 ? "│" : " ") +
        (wrongGuesses > 3 ? "\\" : " "),
      "  │    " +
        (wrongGuesses > 4 ? "/" : " ") +
        " " +
        (wrongGuesses > 5 ? "\\" : " "),
      "  │",
      "──┴──",
    ];
    return parts.join("\n");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
       
             <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">
              Hangman
            </h1>
          </div> <p className="text-gray-300 text-sm sm:text-lg">
                       Guess the blockchain and Ethereum-related terms!

            </p>
        
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Game Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge
                  variant={
                    gameStatus === "won"
                      ? "default"
                      : gameStatus === "lost"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {gameStatus === "won"
                    ? "🎉 You Won!"
                    : gameStatus === "lost"
                    ? "💀 Game Over"
                    : "🎮 Playing"}
                </Badge>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Wrong guesses: {wrongGuesses}/{MAX_WRONG_GUESSES}
                </p>
                <HangmanDrawing step={wrongGuesses} />
              </div>

              <div className="text-center">
                <div className="text-2xl font-mono font-bold tracking-wider mb-4 p-4 bg-gray-50 rounded">
                  {displayWord}
                </div>
                <p className="text-sm text-gray-600">
                  {currentWordData.word.length} letters
                </p>
              </div>

              {showDefinition && (
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Definition:
                  </h3>
                  <p className="text-blue-700">{currentWordData.definition}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div>
            <Card className="h-fit " >
              <CardHeader>
                <CardTitle className="text-center">Letter Guesses</CardTitle>
              </CardHeader>
              <CardContent className="h-fit">
                <div className="grid grid-cols-6 gap-2">
                  {alphabet.map((letter) => (
                    <Button
                      key={letter}
                      variant="outline"
                      size="sm"
                      onClick={() => handleLetterGuess(letter)}
                      disabled={
                        guessedLetters.has(letter) || gameStatus !== "playing"
                      }
                      className={`aspect-square ${
                        guessedLetters.has(letter)
                          ? currentWordData.word.includes(letter)
                            ? "!bg-green-600 !text-white hover:!bg-green-700 border-green-600"
                            : "!bg-red-600 !text-white hover:!bg-red-700 border-red-600"
                          : ""
                      }`}
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="text-center mt-8">
              <Button onClick={startNewGame}   className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30 border px-3 sm:px-4 py-2 text-xs sm:text-base">
                New Game
              </Button>
            </div>
            
            <div className="space-y-3 mt-4">
              {gameStatus !== "playing" && (
                <div className="text-center">
                  <p className="text-white font-semibold mb-3">
                    {gameStatus === "won"
                      ? "🎉 Congratulations! You found the word!"
                      : "😔 You lost! The word was: " + currentWordData.word}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* New Game Button at the bottom */}
      </div>
    </div>
  );
}
