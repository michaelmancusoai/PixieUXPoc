import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import { NavigationWrapper } from "@/components/NavigationWrapper";

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Office Leaderboard</h1>
          <p className="text-muted-foreground">
            Track your team's performance and celebrate top achievers.
          </p>
        </div>

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