import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, User, Star } from "lucide-react";
import { NavigationWrapper } from "@/components/NavigationWrapper";

// Using the existing pixel styles from the app

interface LeaderboardEntry {
  id: number;
  name: string;
  position: string;
  score: number;
  avatarUrl?: string;
  rank: number;
}

// Sample leaderboard data
const leaderboardData: LeaderboardEntry[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Front Desk Coordinator",
    score: 950,
    avatarUrl: "",
    rank: 1
  },
  {
    id: 2,
    name: "Michael Chen",
    position: "Hygienist",
    score: 925,
    avatarUrl: "",
    rank: 2
  },
  {
    id: 3,
    name: "Taylor Williams",
    position: "Dental Assistant",
    score: 890,
    avatarUrl: "",
    rank: 3
  },
  {
    id: 4,
    name: "Jessica Patel",
    position: "Front Desk Coordinator",
    score: 860,
    avatarUrl: "",
    rank: 4
  },
  {
    id: 5,
    name: "David Rodriguez",
    position: "Treatment Coordinator",
    score: 835,
    avatarUrl: "",
    rank: 5
  },
  {
    id: 6,
    name: "Emily Thompson",
    position: "Dental Assistant",
    score: 810,
    avatarUrl: "",
    rank: 6
  },
  {
    id: 7,
    name: "James Wilson",
    position: "Hygienist",
    score: 780,
    avatarUrl: "",
    rank: 7
  },
  {
    id: 8,
    name: "Alex Martinez",
    position: "Front Desk Coordinator",
    score: 755,
    avatarUrl: "",
    rank: 8
  },
  {
    id: 9,
    name: "Samantha Lee",
    position: "Dental Assistant",
    score: 730,
    avatarUrl: "",
    rank: 9
  },
  {
    id: 10,
    name: "Daniel Clark",
    position: "Treatment Coordinator",
    score: 700,
    avatarUrl: "",
    rank: 10
  }
];

export default function LeaderboardPage() {
  return (
    <NavigationWrapper>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Office Leaderboard</h1>
          <p className="text-muted-foreground">
            Track your team's performance and celebrate top achievers.
          </p>
        </div>

        {/* Retro Game Styled Leaderboard */}
        <div className="mb-6 relative font-press-start">
          <div className="border-4 border-blue-600 rounded-md overflow-hidden">
            {/* Header Bar */}
            <div className="bg-blue-600 text-white p-2 text-center text-sm">
              Planet Pixie: Leaderboard
            </div>
            
            {/* Leaderboard Content */}
            <div className="bg-blue-100 p-4">
              {/* Rank Bar */}
              <div className="flex justify-between items-center mb-4">
                <div className="bg-blue-200 rounded-md px-2 py-1 border-2 border-blue-600">
                  <span className="text-blue-800 text-xs">OFFICE RANK: #2</span>
                </div>
                <div className="bg-yellow-200 rounded-md px-2 py-1 border-2 border-yellow-600">
                  <span className="text-yellow-800 text-xs">YOUR SCORE: 835</span>
                </div>
              </div>
              
              {/* Top Players */}
              <div className="bg-white border-4 border-blue-600 rounded-md p-4 mb-4">
                <div className="text-blue-800 font-bold mb-3 text-sm">TOP PLAYERS:</div>
                <div className="space-y-2">
                  {leaderboardData.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center p-2 border-b-2 border-blue-200">
                      <div className="flex items-center">
                        <div className={`w-6 h-6 flex items-center justify-center text-xs ${
                          entry.rank === 1 ? 'bg-yellow-300 text-yellow-800' : 
                          entry.rank === 2 ? 'bg-gray-300 text-gray-800' : 
                          entry.rank === 3 ? 'bg-amber-300 text-amber-800' : 
                          'bg-blue-200 text-blue-800'
                        } mr-2`}>
                          {entry.rank}
                        </div>
                        <div className="text-xs">{entry.name}</div>
                      </div>
                      <div className="text-xs">
                        {entry.score} pts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Your Stats */}
              <div className="flex justify-between gap-4">
                <div className="bg-white border-4 border-blue-600 rounded-md p-3 flex-1">
                  <div className="text-blue-800 font-bold mb-2 text-xs">YOUR ACHIEVEMENTS:</div>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-yellow-200 flex items-center justify-center mb-1 border-2 border-yellow-600">
                          <Trophy className="h-4 w-4 text-yellow-800" />
                        </div>
                        <div className="text-[8px] text-center">Badge {i + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white border-4 border-blue-600 rounded-md p-3 flex-1">
                  <div className="text-blue-800 font-bold mb-2 text-xs">YOUR STATS:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-200 p-2 text-center border-2 border-blue-600">
                      <div className="text-xs font-bold text-blue-800">5</div>
                      <div className="text-[8px] text-blue-800">Rank</div>
                    </div>
                    <div className="bg-purple-200 p-2 text-center border-2 border-purple-600">
                      <div className="text-xs font-bold text-purple-800">12</div>
                      <div className="text-[8px] text-purple-800">Challenges</div>
                    </div>
                    <div className="bg-amber-200 p-2 text-center border-2 border-amber-600">
                      <div className="text-xs font-bold text-amber-800">28</div>
                      <div className="text-[8px] text-amber-800">Day Streak</div>
                    </div>
                    <div className="bg-green-200 p-2 text-center border-2 border-green-600">
                      <div className="text-xs font-bold text-green-800">94%</div>
                      <div className="text-[8px] text-green-800">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom status bar */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-xs text-blue-800 font-bold flex items-center">
                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                  STREAK: 28 DAYS
                </div>
                <div className="text-xs text-blue-800 font-bold">
                  UPDATED: 3 MIN AGO
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern UI Cards - These provide alternative view for users who prefer modern UI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Performers Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-blue-600">
                  <Trophy className="mr-2 h-5 w-5" /> Top Performers
                </CardTitle>
                <CardDescription>
                  Ranked by challenge completions and patient engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {leaderboardData.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent/50 transition-colors border"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                          entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                          entry.rank === 2 ? 'bg-slate-100 text-slate-700' : 
                          entry.rank === 3 ? 'bg-amber-100 text-amber-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {entry.rank}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={entry.avatarUrl} alt={entry.name} />
                          <AvatarFallback>{entry.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{entry.name}</div>
                          <div className="text-sm text-muted-foreground">{entry.position}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{entry.score}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats and Achievements */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-green-600">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-green-700">835 points</div>
                    <div className="text-sm text-green-600">Current Score</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-blue-700">5</div>
                      <div className="text-sm text-blue-600">Rank</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-purple-700">12</div>
                      <div className="text-sm text-purple-600">Challenges</div>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-amber-700">28</div>
                      <div className="text-sm text-amber-600">Day Streak</div>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-indigo-700">94%</div>
                      <div className="text-sm text-indigo-600">Success Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-amber-600">Recent Badges</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-1">
                        <Trophy className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="text-xs text-center">Badge {i + 1}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </NavigationWrapper>
  );
}