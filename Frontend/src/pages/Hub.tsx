import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from '@/components/Navbar';
import HubHeader from '@/components/HubHeader';
import PostCard from '@/components/PostCard';
import HubSidebar from '@/components/HubSidebar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
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

  useEffect(() => {
    const fetchHubData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/hubs/${hubId}`);
        const data = await res.json();
        const currentUserId = getCurrentUserId();

        const updatedHub: Hub = {
          ...data,
          memberCount: data.members.length,
          isCreator: data.creator === currentUserId,
          isJoined: data.members.some(member => member._id === currentUserId),
        };

        setHubData(updatedHub);

        const postsRes = await fetch(`http://localhost:5000/api/posts/hub/${hubId}`);
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
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
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

              <TabsContent value="challenges" className="space-y-4">
                {posts.filter((post) => post.title.toLowerCase().includes('challenge')).map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </TabsContent>

              <TabsContent value="discussions" className="space-y-4">
                {posts.filter(
                  (post) =>
                    post.title.toLowerCase().includes('tips') ||
                    post.title.toLowerCase().includes('discussion')
                ).map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
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
