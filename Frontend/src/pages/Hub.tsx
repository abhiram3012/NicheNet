import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from '@/components/Navbar';
import HubHeader from '@/components/HubHeader';
import PostCard from '@/components/PostCard';
import HubSidebar from '@/components/HubSidebar';
import QuestionCard from '@/components/QuestionCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, BarChart3, Users, HelpCircle, MessageSquare, FileQuestion } from 'lucide-react';
import { decodeJWT } from '@/utils/decodeJWT';
import { EmptyState } from '@/components/EmptyState';
import AskQuestionDialog from '@/components/AskQuestionDialog';
import { timeAgo } from '@/utils/timeAgo';


interface Hub {
  id: string;
  name: string;
  description: string;
  creator: string;
  memberCount: number;
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
  upvotes: string[];
  downvotes: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
}

const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem("token");
  const decoded = token ? decodeJWT(token) : null;
  const currentUserId = decoded?._id || decoded?.id;
  return currentUserId || null;
};

const Hub = () => {
  const { hubId } = useParams();
  const [activeTab, setActiveTab] = useState('posts');
  const [hubData, setHubData] = useState<Hub | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [polls, setPolls] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [userPolls, setUserPolls] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchExtraData = async () => {
      const currentUserId = getCurrentUserId();

      const pollsRes = await fetch(`http://localhost:5000/api/polls/hub/${hubId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const pollData = await pollsRes.json();
      setPolls(pollData);

      const questionsRes = await fetch(`http://localhost:5000/api/questions/hub/${hubId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const questionsData = await questionsRes.json();
      setQuestions(questionsData);
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
      setPolls(prev => prev.map(p => p.pollId === pollId ? updatedPoll : p));
    } catch (err) {
      console.error('Voting error:', err);
    }
  };

  useEffect(() => {
    const fetchMyActivity = async () => {
      const currentUserId = getCurrentUserId();

      const [userPostsRes, userPollsRes, userQuestionsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/posts/hub/${hubId}/user/${currentUserId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }),
        fetch(`http://localhost:5000/api/polls/hub/${hubId}/user/${currentUserId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }),
        fetch(`http://localhost:5000/api/questions/hub/${hubId}/user/${currentUserId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }),
      ]);

      const [postsData, pollsData, questionsData] = await Promise.all([
        userPostsRes.json(), userPollsRes.json(), userQuestionsRes.json()
      ]);

      setUserPosts(postsData);
      setUserPolls(pollsData);
      setUserQuestions(questionsData);
    };

    fetchMyActivity();
  }, [hubId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/questions/hub/${hubId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Failed to fetch questions", err);
      }
    };

    fetchQuestions();
  }, [hubId]);

  if (loading || !hubData) return <div className="p-10 text-center text-gray-600 dark:text-gray-400">Loading Hub...</div>;


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <HubHeader hubData={hubData} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger 
                  value="posts"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger 
                  value="polls"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
                >
                  Polls
                </TabsTrigger>
                <TabsTrigger 
                  value="questions"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
                >
                  Questions
                </TabsTrigger>
                <TabsTrigger 
                  value="my-activity"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
                >
                  My Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-4">
                {posts.length === 0 ? (
                  <EmptyState 
                    icon={FileQuestion} 
                    title="No Posts Yet" 
                    message="Posts shared in this hub will appear here. Be the first to create one!" 
                  />
                ) : (
                  posts.map((post) => (
                    <PostCard key={post._id} post={post} hubCreatorId={hubData.isCreator} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="polls" className="space-y-4">
                <div className="mb-4">
                  <Link to={`/hub/${hubId}/create-poll`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Create New Poll
                    </Button>
                  </Link>
                </div>
                
                {polls.length === 0 ? (
                  <EmptyState 
                    icon={BarChart3} 
                    title="No Polls Yet" 
                    message="Create interactive polls to engage your community." 
                  />
                ) : (
                polls.map((poll) => (
                  <Card key={poll.pollId} className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg dark:text-white">{poll.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span>by {poll.author}</span>
                            {poll.isCreator && (
                              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs">
                                Creator
                              </Badge>
                            )}
                            <span>•</span>
                            <span>{timeAgo(poll.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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
                                className={`flex-1 justify-start ${
                                  poll.hasVoted && poll.userVote === option.text 
                                    ? "dark:bg-blue-700 dark:hover:bg-blue-600" 
                                    : "dark:border-gray-600 dark:hover:bg-gray-700"
                                }`}
                                onClick={() => handleVote(poll.pollId, option.text)}
                                disabled={poll.hasVoted}
                              >
                                {option.text}
                              </Button>
                              <span className="text-sm text-gray-500 dark:text-gray-400 ml-3">
                                {option.percentage}%
                              </span>
                            </div>
                            {poll.hasVoted && (
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${option.percentage}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )))}
              </TabsContent>
              
              <TabsContent value="questions" className="space-y-4">
                <div className="mb-4">
                   <AskQuestionDialog>
                    <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Ask a Question
                    </Button>
                  </AskQuestionDialog>
                </div>

                {questions.length === 0 ? (
                  <EmptyState 
                    icon={HelpCircle} 
                    title="No Questions Yet" 
                    message="Have something in mind? Start a discussion by asking a question." 
                  />
                ) : (
                  questions.map((question) => (
                    <QuestionCard key={question.id} question={question} />
                  ))
                )}
              </TabsContent>


              <TabsContent value="my-activity" className="space-y-4">
                {(userPosts.length > 0 || userPolls.length > 0 || userQuestions.length > 0) ? (
                  <div className="space-y-4">
                    {/* User's Posts */}
                    {userPosts.map((post) => (
                      <PostCard key={`post-${post.id}`} post={post} />
                    ))}
                    
                    {/* User's Polls */}
                    {userPolls.map((poll) => (
                      <Card key={`poll-${poll.id}`} className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg dark:text-white">{poll.title}</CardTitle>
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs">
                                  Poll
                                </Badge>
                                <span>•</span>
                                <span>{poll.timePosted}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <BarChart3 className="w-4 h-4" />
                              {poll.totalVotes} votes
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                    
                    {/* User's Questions */}
                    {userQuestions.map((question) => (
                      <Card key={`question-${question.id}`} className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg dark:text-white">{question.title}</CardTitle>
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-xs">
                                  Question
                                </Badge>
                                <span>•</span>
                                <span>{question.timePosted}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <MessageSquare className="w-4 h-4" />
                              {question.answersCount} answers
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 dark:text-gray-300">{question.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                    <CardContent className="p-8 text-center">
                      <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">No activity yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't created any posts, polls, or questions in this hub yet.</p>
                      <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                        Start Contributing
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