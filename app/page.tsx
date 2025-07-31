import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smile, Type } from "lucide-react"
import Link from "next/link"

export default function Page() {
  const games = [
   
    {
      id: "hangman",
      title: "Hangman",
      description: "Guess the word, save the man!",
      icon: Type,
      href: "/hangman",
      color: "from-red-500 to-orange-600",
      bgColor: "bg-gradient-to-br from-red-500/10 to-orange-600/10"
    },
    {
      id: "faces",
      title: "EthOS Faces",
      description: "Match the facial expressions and learn emotions!",
      icon: Smile,
      href: "/faces",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-gradient-to-br from-green-500/10 to-emerald-600/10"
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
          {games.map((game) => {
            const IconComponent = game.icon
            return (
              <Card key={game.id} className="group hover:scale-105 transition-all duration-300 border-white/20 bg-white/5 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${game.bgColor} flex items-center justify-center`}>
                    <IconComponent className={`w-8 h-8 bg-gradient-to-r ${game.color} bg-clip-text text-transparent`} />
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
                      className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 transition-all duration-300`}
                    >
                      Play
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer */}
     
      </div>
    </div>
  )
}
