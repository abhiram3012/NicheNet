
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import HubCard from '@/components/HubCard';
import HighlightCard from '@/components/HighlightCard';
import UserSnapshot from '@/components/UserSnapshot';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Star, Award, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { decodeJWT } from "@/utils/decodeJWT";

const Index = () => {
  const [createdHubs, setCreatedHubs] = useState([]);
  const [yourHubs, setYourHubs] = useState([]);
  const [discoverHubs, setDiscoverHubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get current user ID from localStorage
  const token = localStorage.getItem("token"); // stored token string
  const decoded = token ? decodeJWT(token) : null;
  const currentUserId = decoded?._id || decoded?.id; // depending on how you signed the token

  useEffect(() => {
    const fetchAllHubs = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [createdRes, joinedRes, discoverRes] = await Promise.all([
          fetch(`http://localhost:5000/api/hubs/my-created`, { headers }),
          fetch(`http://localhost:5000/api/users/joined-hubs`, { headers }),
          fetch(`http://localhost:5000/api/hubs/suggestions`, { headers })
        ]);

        const [createdData, joinedData, discoverData] = await Promise.all([
          createdRes.json(),
          joinedRes.json(),
          discoverRes.json()
        ]);

        // if (!createdRes.ok || !joinedRes.ok || !discoverRes.ok) {
        //   throw new Error('One or more requests failed');
        // }

        setCreatedHubs(createdData);
        setYourHubs(joinedData);
        setDiscoverHubs(discoverData);
        console.log('suggested hubs:', discoverData);
      } catch (err) {
        console.error('Failed to fetch hubs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllHubs();
  }, []);


  // Mock data for hubs the user has created
  // const createdHubs = [
  //   {
  //     id: '7',
  //     name: 'AI Art Collective',
  //     description: 'A community for artists experimenting with AI-generated art and digital creativity.',
  //     memberCount: 4523,
  //     newPosts: 8,
  //     lastActive: '3h ago',
  //     activeUsers: 67,
  //     isJoined: true,
  //     category: 'Creative',
  //     imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop&crop=center'
  //   },
  //   {
  //     id: '8',
  //     name: 'Weekend Warriors',
  //     description: 'For busy professionals who love outdoor adventures on weekends.',
  //     memberCount: 1890,
  //     newPosts: 5,
  //     lastActive: '6h ago',
  //     activeUsers: 23,
  //     isJoined: true,
  //     category: 'Outdoor'
  //   }
  // ];

  // const yourHubs = [
  //   {
  //     id: '1',
  //     name: 'Photography',
  //     description: 'Share your best shots and learn new techniques from fellow photographers.',
  //     memberCount: 15420,
  //     newPosts: 12,
  //     lastActive: '2h ago',
  //     activeUsers: 89,
  //     isJoined: true,
  //     category: 'Creative',
  //     imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=100&h=100&fit=crop&crop=center'
  //   },
  //   {
  //     id: '2',
  //     name: 'Poetry Corner',
  //     description: 'Express your emotions through words and connect with fellow poets.',
  //     memberCount: 8234,
  //     newPosts: 7,
  //     lastActive: '1h ago',
  //     activeUsers: 34,
  //     isJoined: true,
  //     category: 'Writing'
  //   },
  //   {
  //     id: '3',
  //     name: 'Code Crafters',
  //     description: 'Discuss programming languages, share projects, and solve coding challenges.',
  //     memberCount: 23145,
  //     newPosts: 23,
  //     lastActive: '30m ago',
  //     activeUsers: 156,
  //     isJoined: true,
  //     category: 'Technology',
  //     imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop&crop=center'
  //   }
  // ];

  // const discoverHubs = [
  //   {
  //     id: '4',
  //     name: 'Digital Art Studio',
  //     description: 'Create, share, and get feedback on your digital artwork and illustrations.',
  //     memberCount: 12890,
  //     newPosts: 18,
  //     lastActive: '45m ago',
  //     activeUsers: 78,
  //     isJoined: false,
  //     category: 'Creative',
  //     imageUrl: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=100&h=100&fit=crop&crop=center'
  //   },
  //   {
  //     id: '5',
  //     name: 'Hiking Adventures',
  //     description: 'Share trail photos, hiking tips, and plan group adventures.',
  //     memberCount: 9876,
  //     newPosts: 15,
  //     lastActive: '1h ago',
  //     activeUsers: 45,
  //     isJoined: false,
  //     category: 'Outdoor',
  //     imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=100&h=100&fit=crop&crop=center'
  //   },
  //   {
  //     id: '6',
  //     name: 'Cooking Experiments',
  //     description: 'Share recipes, cooking tips, and your culinary creations.',
  //     memberCount: 18567,
  //     newPosts: 31,
  //     lastActive: '20m ago',
  //     activeUsers: 92,
  //     isJoined: false,
  //     category: 'Food',
  //     imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=center'
  //   }
  // ];

  const highlights = [
    {
      title: 'Most Active Hub Today',
      value: 'Code Crafters',
      description: '156 users online',
      icon: TrendingUp,
      color: 'blue' as const
    },
    {
      title: 'New Members This Week',
      value: '2,847',
      description: '+12% from last week',
      icon: Users,
      color: 'green' as const
    },
    {
      title: 'Featured Creator',
      value: '@alexartist',
      description: 'Digital Art Studio',
      icon: Star,
      color: 'orange' as const
    },
    {
      title: 'Weekly Challenge',
      value: 'Draw Your Mood',
      description: '247 submissions',
      icon: Award,
      color: 'purple' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back! 👋</h1>
          <p className="text-gray-600">Explore your communities and discover new passions.</p>
        </div>

        {/* Hubs You Created Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Hubs You Created</h2>
            <Link to="/create-hub">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Create New Hub
              </Button>
            </Link>
          </div>
          {createdHubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdHubs.map((hub) => (
                <HubCard
                  key={hub._id}
                  id={hub._id}
                  name={hub.name}
                  description={hub.description}
                  memberCount={hub.members.length} // ✅ count instead of array
                  newPosts={hub.newPosts || 0}
                  lastActive={hub.lastActive || 'unknown'}
                  activeUsers={hub.activeUsers || 0}
                  isJoined={hub.members.includes(currentUserId)}
                  isCreator={hub.creator === currentUserId}
                  category={hub.category || 'General'}
                  imageUrl={hub.imageUrl}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No hubs created yet</h3>
              <p className="text-gray-600 mb-4">Start building your own community around your passions!</p>
              <Link to="/create-hub">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Hub
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Your Hubs Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Hubs</h2>
            <Button variant="outline" size="sm">
              Manage All
            </Button>
          </div>

          {yourHubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yourHubs.map((hub) => (
                <HubCard
                  key={hub._id}
                  id={hub._id}
                  name={hub.name}
                  description={hub.description}
                  memberCount={hub.members?.length || hub.memberCount || 0} // handles both formats
                  newPosts={hub.newPosts || 0}
                  lastActive={hub.lastActive || 'unknown'}
                  activeUsers={hub.activeUsers || 0}
                  isJoined={true} // this section is only for joined hubs
                  isCreator={hub.creator === currentUserId}
                  category={hub.category || 'General'}
                  imageUrl={hub.imageUrl || hub.bannerUrl}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">You're not a member of any hubs yet</h3>
              <p className="text-gray-600 mb-4">Join hubs that interest you to start participating in discussions.</p>
              <Link to="/explore">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Explore Hubs
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Highlights Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Community Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {highlights.map((highlight, index) => (
              <HighlightCard key={index} {...highlight} />
            ))}
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discover Hubs */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Discover New Hubs</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">🔥 Trending Now</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {discoverHubs.map((hub) => (
                    <HubCard
                    key={hub._id}
                    id={hub._id}
                    name={hub.name}
                    description={hub.description}
                    memberCount={hub.members?.length || hub.memberCount || 0} // handles both formats
                    newPosts={hub.newPosts || 0}
                    lastActive={hub.lastActive || 'unknown'}
                    activeUsers={hub.activeUsers || 0}
                    isJoined={false} // this section is only for joined hubs
                    isPrivate={hub.isPrivate || false}
                    isCreator={hub.creator === currentUserId}
                    category={hub.category || 'General'}
                    imageUrl={hub.imageUrl || hub.bannerUrl}
                  />
                  ))}
                </div>
              </div>
              
              <div className="text-center py-6">
                <Button variant="outline" className="border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50">
                  🎲 Explore Random Hub
                </Button>
              </div>
            </div>
          </div>

          {/* User Snapshot */}
          <div className="lg:col-span-1">
            <UserSnapshot />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
