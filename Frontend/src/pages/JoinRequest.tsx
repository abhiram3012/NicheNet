import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Users, ArrowLeft, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { decodeJWT } from '@/utils/decodeJWT';

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
  pendingRequests?: string[];
  hasRequested?: boolean;
  isPrivate?: boolean; // Added since we use it in the component
}

const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem("token");
  const decoded = token ? decodeJWT(token) : null;
  const currentUserId = decoded?._id || decoded?.id;
  return currentUserId || null;
};

const JoinRequest = () => {
  const { hubId } = useParams<{ hubId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [hubData, setHubData] = useState<Hub | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!hubId) return;

    const fetchHub = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const res = await axios.get(`http://localhost:5000/api/hubs/${hubId}`, { headers });
        const data = res.data;
        const currentUserId = getCurrentUserId();

        const updatedHub: Hub = {
          ...data,
          memberCount: data.members.length,
          isCreator: data.creator === currentUserId,
          isJoined: data.members.some((m) => m._id === currentUserId),
          hasRequested: data.pendingRequests.includes(currentUserId),
          isPrivate: data.isPrivate, // Ensure this is set
        };

        setHubData(updatedHub);
      } catch (err) {
        toast({
          title: "Error loading hub",
          description: err.response?.data?.message || "Could not fetch hub data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHub();
  }, [hubId, toast]);

  const handleGoBack = () => navigate(-1);

  const handleSendRequest = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/hubs/${hubId}/request`, {}, { headers });
      toast({
        title: "Join request sent!",
        description: "You'll be notified once it's reviewed by the moderators.",
      });
      navigate('/dashboard');
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-gray-600 dark:text-gray-400">Loading hub details...</div>;
  }

  if (!hubData) {
    return <div className="p-6 text-red-600 dark:text-red-400">Hub not found or an error occurred.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="mb-6 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Hub Card */}
        <Card className="mb-8 overflow-hidden rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div 
            className="h-32 sm:h-48 md:h-56 bg-cover bg-center bg-gray-200"
            style={{
              backgroundImage: `url(${hubData.bannerUrl || 'https://source.unsplash.com/random/1200x400?technology'})`
            }}
          />
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{hubData.name}</h1>
                  {hubData.isPrivate && (
                    <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-2 py-0.5 rounded text-sm flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Private
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3">{hubData.description}</p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{hubData.memberCount} members</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Card */}
        <CardContent className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
          {hubData.hasRequested ? (
            <Button 
              disabled 
              className="bg-gray-400 dark:bg-gray-700 cursor-not-allowed text-white dark:text-gray-300"
            >
              <Send className="w-4 h-4 mr-2" />
              Request Sent
            </Button>
          ) : (
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleSendRequest}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          )}
        </CardContent>
      </main>
    </div>
  );
};

export default JoinRequest;