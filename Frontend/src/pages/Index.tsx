import React, { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import HubCard from '@/components/HubCard';
import HighlightCard from '@/components/HighlightCard';
import UserSnapshot from '@/components/UserSnapshot';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Star, Award, Plus, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { decodeJWT } from "@/utils/decodeJWT";

const Index = () => {
  const [createdHubs, setCreatedHubs] = useState([]);
  const [yourHubs, setYourHubs] = useState([]);
  const [discoverHubs, setDiscoverHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const discoverRef = useRef<HTMLDivElement | null>(null);

  // Get current user ID from localStorage
  const token = localStorage.getItem("token");
  const decoded = token ? decodeJWT(token) : null;
  const currentUserId = decoded?._id || decoded?.id;

  useEffect(() => {
    const fetchAllHubs = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [createdRes, joinedRes, discoverRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/hubs/my-created`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/users/joined-hubs`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/hubs/suggestions`, { headers })
        ]);

        const [createdData, joinedData, discoverData] = await Promise.all([
          createdRes.json(),
          joinedRes.json(),
          discoverRes.json()
        ]);

        setCreatedHubs(createdData);
        setYourHubs(joinedData);
        setDiscoverHubs(discoverData);
      } catch (err) {
        console.error('Failed to fetch hubs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllHubs();
  }, []);

  const filteredYourHubs = yourHubs.filter(
  (hub) => !createdHubs.some((created) => created._id === hub._id)
);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center mb-4 px-4 py-2 bg-blue-900/30 rounded-full">
            <span className="text-sm font-medium text-blue-300">
              Explore, Create, Connect
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome Back to Your Communities!
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-6">
            Discover new passions and connect with like-minded creators
          </p>
          
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => {
                discoverRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-5 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <Search className="w-5 h-5 mr-2" />
              Explore Hubs
            </Button>
            <Link to="/create-hub">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-5 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <Plus className="w-5 h-5 mr-2" />
                Create Hub
              </Button>
            </Link>
          </div>
        </div>

        {/* Hubs You Created Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Hubs You Created</h2>
              <p className="text-gray-400 mt-1">Your communities, your rules</p>
            </div>
            <Link to="/create-hub">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 px-5 py-3 rounded-xl shadow-md">
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </Link>
          </div>
          
          {createdHubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdHubs.map((hub) => (
                <div key={hub._id} className="transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
                  <HubCard
                    id={hub._id}
                    name={hub.name}
                    description={hub.description}
                    memberCount={hub.members.length}
                    newPosts={hub.newPosts || 0}
                    lastActive={hub.lastActive || 'unknown'}
                    activeUsers={hub.activeUsers || 0}
                    isJoined={hub.members.includes(currentUserId)}
                    isCreator={hub.creator === currentUserId}
                    category={hub.category || 'General'}
                    bannerUrl={hub.bannerUrl}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-10 text-center shadow-sm">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Create Your First Hub</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Build a community around your passions and connect with like-minded people.
              </p>
              <Link to="/create-hub">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-6 py-5 rounded-xl shadow-md">
                  <Plus className="w-5 h-5 mr-2" />
                  Start Building
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Your Hubs Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Your Communities</h2>
              <p className="text-gray-400 mt-1">Hubs you're part of</p>
            </div>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 px-5 py-3 rounded-xl">
              Manage All
            </Button>
          </div>

          {filteredYourHubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredYourHubs.map((hub) => (
                <div key={hub._id} className="transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
                  <HubCard
                    id={hub._id}
                    name={hub.name}
                    description={hub.description}
                    memberCount={hub.members?.length || hub.memberCount || 0}
                    newPosts={hub.newPosts || 0}
                    lastActive={hub.lastActive || 'unknown'}
                    activeUsers={hub.activeUsers || 0}
                    isJoined={true}
                    isCreator={hub.creator === currentUserId}
                    category={hub.category || 'General'}
                    bannerUrl={hub.bannerUrl || hub.bannerUrl}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-10 text-center shadow-sm">
              <div className="w-24 h-24 bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Join Your First Community</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Discover hubs that match your interests and start collaborating with creators.
              </p>
              <Link to="/explore">
                <Button className="bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700 px-6 py-5 rounded-xl shadow-md">
                  Explore Hubs
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Discover Hubs */}
        {/* Discover Hubs */}
        <section ref={discoverRef} className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Discover New Hubs</h2>
              <p className="text-gray-400 mt-1">Trending communities you might like</p>
            </div>
            <Button variant="ghost" className="text-blue-400">
              See all <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-sm">
            {discoverHubs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                {/* You can use an illustration or icon here if you'd like */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4.354a4.5 4.5 0 100 8.792m0 0v2.354m0 0l2 2m-2-2l-2 2"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-300">No hubs found</h3>
                <p className="text-gray-500 mt-1">Check back later or create a new hub to get started!</p>
              </div>
            ) : (
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {discoverHubs.slice(0, 4).map((hub) => (
                    <div key={hub._id} className="transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
                      <HubCard
                        id={hub._id}
                        name={hub.name}
                        description={hub.description}
                        memberCount={hub.members?.length || hub.memberCount || 0}
                        newPosts={hub.newPosts || 0}
                        lastActive={hub.lastActive || 'unknown'}
                        activeUsers={hub.activeUsers || 0}
                        isJoined={false}
                        isPrivate={hub.isPrivate || false}
                        isCreator={hub.creator === currentUserId}
                        category={hub.category || 'General'}
                        bannerUrl={hub.bannerUrl || hub.bannerUrl}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;