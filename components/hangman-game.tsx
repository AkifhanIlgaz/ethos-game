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
      "Layer 2 scaling solution that bundles multiple transactions off-chain and posts them on Ethereum.",
  },
  {
    word: "SEQUENCER",
    definition:
      "A component in rollups that orders and submits transactions to the L1.",
  },
  {
    word: "SETTLEMENT",
    definition:
      "The process of finalizing and anchoring Layer 2 transactions onto Ethereum mainnet.",
  },
  {
    word: "SHAREDSEQUENCER",
    definition:
      "A decentralized sequencer design used by multiple rollups to coordinate ordering.",
  },
  {
    word: "INTENT",
    definition:
      "A user’s desired outcome or action, which can be fulfilled by different actors on-chain.",
  },
  {
    word: "MEV",
    definition:
      "(Maximal Extractable Value) — profit miners or validators can gain by reordering transactions.",
  },
  {
    word: "APPCHAIN",
    definition:
      "A blockchain customized for a single application, often built on modular frameworks.",
  },
  {
    word: "INTEROPERABILITY",
    definition:
      "The ability of different blockchains and systems to work and communicate with each other.",
  },
  {
    word: "ZKPROOF",
    definition:
      "(Zero-Knowledge Proof) — cryptographic proof that allows one party to prove something is true without revealing the data itself.",
  },
  {
    word: "MODULARITY",
    definition:
      "Design principle where components (e.g., execution, settlement, data availability) can be swapped or independently upgraded.",
  },
  {
    word: "EIGENLAYER",
    definition:
      "A restaking protocol for Ethereum, enabling shared security across services.",
  },
  {
    word: "MODULAR",
    definition:
      "EthereumOS embraces this approach: separate layers for execution, data availability, and consensus.",
  },
  {
    word: "BLOBSTREAM",
    definition:
      "Data availability layer used by EthereumOS to publish L2 data on L1.",
  },
  {
    word: "SHAREDSECURITY",
    definition:
      "Multiple services use the same trust base via Ethereum staking or restaking.",
  },
  {
    word: "STAKING",
    definition:
      "The act of locking up cryptocurrency to support the operations of a blockchain network in return for rewards.",
  },
  {
    word: "VALIDATOR",
    definition:
      "An entity in a Proof-of-Stake system responsible for proposing and validating new blocks on the blockchain.",
  },
  {
    word: "SOLIDITY",
    definition:
      "A statically-typed programming language designed for developing smart contracts on Ethereum.",
  },
  {
    word: "SMARTCONTRACT",
    definition:
      "Self-executing code that runs on the blockchain and automatically enforces rules and agreements.",
  },
  {
    word: "BLOCKCHAIN",
    definition:
      "A distributed, decentralized ledger composed of blocks that store transactional data securely and immutably.",
  },
  {
    word: "METAMASK",
    definition:
      "A browser extension and mobile wallet used for managing Ethereum accounts and interacting with dApps.",
  },
  {
    word: "HARDHAT",
    definition:
      "A development environment and task runner used to compile, test, and deploy smart contracts on Ethereum.",
  },
  {
    word: "ETHEREUM",
    definition:
      "A decentralized, open-source blockchain platform that enables the creation of smart contracts and decentralized applications.",
  },
  {
    word: "INFURA",
    definition:
      "A service that provides scalable access to Ethereum and IPFS networks without running a full node.",
  },
  {
    word: "LAYER2",
    definition:
      "Secondary frameworks or protocols built on top of Layer 1 blockchains to improve scalability and transaction throughput.",
  },
  {
    word: "ZEROKNOWLEDGE",
    definition:
      "A cryptographic method that allows one party to prove to another that a statement is true without revealing any information.",
  },
  {
    word: "OPTIMISM",
    definition:
      "An Ethereum Layer 2 scaling solution that uses optimistic rollups to reduce gas fees and increase throughput.",
  },
  {
    word: "ARBITRUM",
    definition:
      "A Layer 2 optimistic rollup solution for Ethereum focused on faster and cheaper smart contract execution.",
  },
  {
    word: "MULTISIG",
    definition:
      "A digital signature scheme that requires multiple private keys to authorize a blockchain transaction.",
  },
  {
    word: "DECENTRALIZATION",
    definition:
      "The distribution of authority and control across a blockchain network, reducing reliance on single points of failure.",
  },
  {
    word: "IMMUTABILITY",
    definition:
      "The characteristic of blockchain data that ensures once information is written, it cannot be altered or deleted.",
  },
  {
    word: "DEFI",
    definition:
      "An ecosystem of permissionless financial applications built on blockchain networks, primarily Ethereum.",
  },
  {
    word: "GOVERNANCE",
    definition:
      "The mechanisms and rules through which blockchain protocols and dApps evolve and make collective decisions.",
  },
  {
    word: "DAPP",
    definition: "A decentralized application running on a blockchain network.",
  },
  {
    word: "WALLET",
    definition:
      "A digital tool to store and manage your cryptocurrencies and private keys.",
  },
  {
    word: "ERC20",
    definition: "The standard for fungible tokens on the Ethereum blockchain.",
  },
  {
    word: "NFT",
    definition: "A non-fungible token representing unique digital ownership.",
  },
  {
    word: "NODE",
    definition:
      "A computer that participates in the blockchain network by maintaining a copy of the ledger.",
  },
  {
    word: "HASH",
    definition:
      "A fixed-length string generated from data, used in blockchain for security and integrity.",
  },
  {
    word: "FORK",
    definition:
      "A change to a blockchain protocol that may create a separate version of the chain.",
  },
  {
    word: "WEB3",
    definition:
      "A new iteration of the internet focused on decentralization, blockchain, and user ownership.",
  },
  {
    word: "GAS",
    definition:
      "A fee paid to perform a transaction or execute a smart contract on Ethereum.",
  },
];

const MAX_WRONG_GUESSES = 6;

export default function HangmanGame() {
  const [currentWordData, setCurrentWordData] = useState(
    WORDS_AND_DEFINITIONS[
      Math.floor(Math.random() * WORDS_AND_DEFINITIONS.length)
    ]
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
          </div>{" "}
          <p className="text-gray-300 text-sm sm:text-lg">
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
            <Card className="h-fit ">
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
              <Button
                onClick={startNewGame}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30 border px-3 sm:px-4 py-2 text-xs sm:text-base"
              >
                New Game
              </Button>
            </div>

            <div className="space-y-3 mt-4">
              {gameStatus !== "playing" && (
                <div className="text-center">
                  <p className="text-white font-bold mb-3">
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
