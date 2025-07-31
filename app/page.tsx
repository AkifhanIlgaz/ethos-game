import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const games = [
    {
      id: "hangman",
      title: "Hangman",
      description: "Guess the word, save the man!",
      href: "/hangman",
      img: "/images/logo1.jpg"
    },
    {
      id: "faces",
      title: "EthOS Faces",
      description: "Match the facial expressions and learn emotions!",
      href: "/faces",
      img: "images/logo2.jpg"
    }
  ]

  return (
    <div className="flex items-start justify-center min-h-screen">
      {/* Header */}
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Eth OS Games
          </h1>
          <p className="text-gray-300 text-lg">
            Play fun games and improve your skills!
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {games.map((game) => (
            <Card key={game.id} className="group hover:scale-105 transition-all duration-300 border-white/20 bg-white/5 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
                  <Image src={game.img} alt="Game Logo" width={48} height={48} className="rounded-full object-cover" />
                </div>
                <CardTitle className="text-white text-xl font-bold">
                  {game.title}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {game.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href={game.href}>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-all duration-300"
                  >
                    Play
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
     
      </div>
    </div>
  )
}
