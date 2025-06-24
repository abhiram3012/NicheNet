import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Crown, ImagePlus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface HubHeaderProps {
  hubData: {
    name: string;
    description: string;
    memberCount: number;
    isJoined?: boolean;
    isCreator?: boolean;
    bannerUrl?: string;
  };
}

const HubHeader: React.FC<HubHeaderProps> = ({ hubData }) => {
  const {
    name,
    description,
    bannerUrl,
    isCreator = false,
  } = hubData;

  const [isJoined, setIsJoined] = useState(hubData.isJoined || false);
  const [memberCount, setMemberCount] = useState(hubData.memberCount || 0);
  const navigate = useNavigate();
  const { hubId } = useParams(); // Assuming route is like /hub/:hubId

  const handleJoinLeave = async () => {
    try {
      const token = localStorage.getItem('token'); // Adjust if you're storing token elsewhere

      if (!token) {
        console.error('No token found');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (isJoined) {
        await axios.post(`http://localhost:5000/api/hubs/${hubId}/leave`, {}, config);
        setIsJoined(false);
        setMemberCount(prev => Math.max(prev - 1, 0));
      } else {
        await axios.post(`http://localhost:5000/api/hubs/${hubId}/join`, {}, config);
        setIsJoined(true);
        setMemberCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Failed to join/leave hub:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Banner area */}
      <div className="relative h-48 bg-gray-100 flex items-center justify-center">
        {bannerUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bannerUrl})` }}
          />
        ) : (
          isCreator && (
            <div className="text-center z-10">
              <ImagePlus className="w-6 h-6 mx-auto mb-1 text-gray-500" />
              <p className="text-sm text-gray-500">Add a banner image</p>
            </div>
          )
        )}
        <div className="absolute inset-0 bg-black opacity-20" />
      </div>

      {/* Hub Info */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
              {isCreator && (
                <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Creator
                </Badge>
              )}
            </div>
            <p className="text-gray-600 mb-4">{description}</p>

            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              <span>{memberCount.toLocaleString()} members</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isCreator && (
              <Button
                onClick={handleJoinLeave}
                variant={isJoined ? 'outline' : 'default'}
                className={isJoined
                  ? 'border-red-300 text-red-600 hover:bg-red-50'
                  : 'bg-blue-600 hover:bg-blue-700'}
              >
                {isJoined ? 'Leave Hub' : 'Join Hub'}
              </Button>
            )}
            {(isCreator || isJoined) && (
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate(`create-post`)}
              >
                Create Post
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubHeader;
