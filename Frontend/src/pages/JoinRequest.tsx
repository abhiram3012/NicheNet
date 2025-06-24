import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Users, ArrowLeft, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { decodeJWT } from '@/utils/decodeJWT';
import axios from 'axios';

const JoinRequest = () => {
  const { hubId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

    // Get current user ID from localStorage
    const token = localStorage.getItem("token"); // stored token string
    const decoded = token ? decodeJWT(token) : null;

  // Replace with actual hub data fetch later
  const hubData = {
    id: hubId,
    name: 'Elite Photography Masters',
    description: 'An exclusive community for professional photographers and serious enthusiasts.',
    memberCount: 127,
    isPrivate: true,
    bannerUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=200&fit=crop&crop=center',
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSendRequest = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.post(`http://localhost:5000/api/hubs/${hubId}/request`,{headers});
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Hub Header */}
        <Card className="mb-8 overflow-hidden">
          {hubData.bannerUrl && (
            <div 
              className="h-32 bg-cover bg-center bg-gray-200"
              style={{ backgroundImage: `url(${hubData.bannerUrl})` }}
            />
          )}
          
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-800">{hubData.name}</h1>
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-sm flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Private
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{hubData.description}</p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{hubData.memberCount} members</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Single Button Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Request to Join
            </CardTitle>
            <p className="text-sm text-gray-600">
              Tap the button below to send your join request.
            </p>
          </CardHeader>

          <CardContent>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleSendRequest}
              className="bg-blue-600 hover:bg-blue-700"
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default JoinRequest;
