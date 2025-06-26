import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from '@/components/Navbar';
import HubHeader from '@/components/HubHeader';
import PostCard from '@/components/PostCard';
import HubSidebar from '@/components/HubSidebar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, BarChart3, Users } from 'lucide-react';
import { decodeJWT } from '@/utils/decodeJWT';

interface Hub {
  id: string;
  name: string;
  description: string;
  creator: string;
  memberCount: number; // <- change from members: string[] to this
  bannerUrl?: string;
  moderators?: string[];
  rules?: string[];
  topContributors?: { username: string; posts: number }[];
  isCreator?: boolean;
  isJoined?: boolean;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  image?: string;
  isAnonymous: boolean;
  author: {
    _id: string;
    username: string;
  };
  hub: string;
  upvotes: number;
  downvotes: number;
  comments: string[];
  createdAt: string;
  updatedAt: string;
}

const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem("token"); // stored token string
  const decoded = token ? decodeJWT(token) : null;
  const currentUserId = decoded?._id || decoded?.id;
  return currentUserId || null;
};

const Hub = () => {
  const { hubId } = useParams();
  const [activeTab, setActiveTab] = useState('recent');
  const [hubData, setHubData] = useState<Hub | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [polls, setPolls] = useState([]);
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchExtraData = async () => {
      const currentUserId = getCurrentUserId();

      const pollsRes = await fetch(`http://localhost:5000/api/polls/hub/${hubId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const pollData = await pollsRes.json();
      setPolls(pollData);
      pollData.forEach(poll => {
        console.log(`Poll: ${poll.title}, Total Votes: ${poll.totalVotes}, ${poll.author.username} created this poll`);
      });           

      // Fetch user's posts in this hub
      const userPostsRes = await fetch(`http://localhost:5000/api/posts/hub/${hubId}/user/${currentUserId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const myPostData = await userPostsRes.json();
      setMyPosts(myPostData);
    };

    if (hubData) fetchExtraData();
  }, [hubId, hubData]);

  useEffect(() => {
    const fetchHubData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/hubs/${hubId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
        const data = await res.json();
        const currentUserId = getCurrentUserId();

        const updatedHub: Hub = {
          ...data,
          memberCount: data.members.length,
          isCreator: data.creator === currentUserId,
          isJoined: data.members.some(member => member._id === currentUserId),
        };

        setHubData(updatedHub);

        const postsRes = await fetch(`http://localhost:5000/api/posts/hub/${hubId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
        const postsData = await postsRes.json();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching hub or posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHubData();
  }, [hubId]);

  const handleVote = async (pollId: string, optionText: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/polls/${pollId}/vote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ optionText })
      });
      const updatedPoll = await res.json();
      setPolls(prev => prev.map(p => p._id === pollId ? updatedPoll : p));
    } catch (err) {
      console.error('Voting error:', err);
    }
  };

  if (loading || !hubData) return <div className="p-10 text-center text-gray-600">Loading Hub...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <HubHeader hubData={hubData} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="top">Top</TabsTrigger>
                <TabsTrigger value="polls">Polls</TabsTrigger>
                <TabsTrigger value="my-posts">My Posts</TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} hubCreatorId={hubData.isCreator} />
                ))}
              </TabsContent>

              <TabsContent value="top" className="space-y-4">
                {posts.filter((post) => post.upvotes > 100).map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </TabsContent>

              <TabsContent value="polls" className="space-y-4">
                <div className="mb-4">
                  <Link to={`/hub/${hubId}/create-poll`}>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Create New Poll
                    </Button>
                  </Link>
                </div>
                
                {polls.map((poll) => (
                  <Card key={poll._id} className="bg-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{poll.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>by {poll.author.username}</span>
                            {poll.isCreator && (
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">Creator</Badge>
                            )}
                            <span>•</span>
                            <span>{poll.timePosted}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <BarChart3 className="w-4 h-4" />
                          {poll.totalVotes} votes
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {poll.options.map((option, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Button
                                variant={poll.hasVoted && poll.userVote === option.text ? "default" : "outline"}
                                className="flex-1 justify-start"
                                onClick={() => handleVote(poll._id, option.text)}
                                disabled={poll.hasVoted}
                              >
                                {option.text}
                              </Button>
                              <span className="text-sm text-gray-500 ml-3">
                                {option.percentage}%
                              </span>
                            </div>
                            {poll.hasVoted && (
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${option.percentage}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="my-posts" className="space-y-4">
                {myPosts.length > 0 ? (
                  myPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))
                ) : (
                  <Card className="bg-white">
                    <CardContent className="p-8 text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">No posts yet</h3>
                      <p className="text-gray-500 mb-4">You haven't created any posts in this hub yet.</p>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Create Your First Post
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          {/* <div className="lg:col-span-1">
            <HubSidebar hubData={hubData} />
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default Hub;
