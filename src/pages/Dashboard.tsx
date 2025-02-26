
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Github } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface GithubUser {
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  contributions?: number;
  name?: string;
  bio?: string;
}

interface Repository {
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<GithubUser | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGithubData = async () => {
      // Check if we're returning from GitHub OAuth
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        // Here you would typically exchange the code for an access token
        // For now, we'll just show a success message
        toast({
          title: "GitHub Connected",
          description: "Successfully connected to GitHub account.",
        });
        localStorage.setItem('github_connected', 'true');
      }

      try {
        // For demo purposes, we'll fetch public data
        // In production, you'd use the OAuth token to fetch private data
        const username = 'example'; // Replace with actual username once OAuth is implemented
        const response = await fetch(`https://api.github.com/users/${username}`);
        const userData = await response.json();
        
        // Fetch user's repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
        const reposData = await reposResponse.json();
        
        setUserData(userData);
        setRepositories(reposData);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch GitHub data. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();
  }, []);

  const userStats = {
    xp: 4000,
    contributions: userData?.public_repos || 0,
    streak: 60,
    level: 23,
    title: 'Explorer',
    roles: ['Contributor', 'Reviewer']
  };

  const calculateProgress = (xp: number) => {
    const nextLevel = 15000; // XP needed for reviewer
    return (xp / nextLevel) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 px-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-3 glass animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-6 w-6" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={userData?.avatar_url || 'https://github.com/github.png'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{userData?.name || userData?.login || 'Username'}</h3>
                {userData?.bio && <p className="text-muted-foreground mb-4">{userData.bio}</p>}
                <div className="flex flex-wrap gap-2 mb-4">
                  {userStats.roles.map(role => (
                    <span key={role} className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                      {role}
                    </span>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Progress to Reviewer</p>
                  <Progress value={calculateProgress(userStats.xp)} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <StatCard title="Total XP" value={userStats.xp.toString()} suffix="XP" />
          <StatCard title="Public Repos" value={userData?.public_repos?.toString() || '0'} />
          <StatCard title="Followers" value={userData?.followers?.toString() || '0'} />
          <StatCard title="Level" value={userStats.level.toString()} />
          <StatCard title="Current Streak" value={userStats.streak.toString()} suffix="days" />
          <StatCard title="Title" value={userStats.title} />

          {/* Recent Repositories */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-3 glass animate-fade-in">
            <CardHeader>
              <CardTitle>Recent Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repositories.map((repo) => (
                  <Card key={repo.name} className="bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-lg">{repo.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{repo.description || 'No description'}</p>
                      <div className="flex justify-between text-sm">
                        <span>{repo.language}</span>
                        <span>⭐ {repo.stargazers_count}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, suffix = '' }: { title: string; value: string; suffix?: string }) => (
  <Card className="glass animate-fade-in hover:scale-105 transition-transform">
    <CardHeader>
      <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">
        {value} {suffix}
      </p>
    </CardContent>
  </Card>
);

export default Dashboard;
