import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Crown, ImagePlus, Settings, Loader2 } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

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
  const { name, description, bannerUrl, isCreator = false } = hubData;
  const [bannerUrl1, setBannerUrl] = useState(hubData?.bannerUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isJoined, setIsJoined] = useState(hubData.isJoined || false);
  const [memberCount, setMemberCount] = useState(hubData.memberCount || 0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hubId } = useParams();

  const handleJoinLeave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (isJoined) {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/hubs/${hubId}/leave`, {}, config);
        setIsJoined(false);
        setMemberCount(prev => Math.max(prev - 1, 0));
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/hubs/${hubId}/join`, {}, config);
        setIsJoined(true);
        setMemberCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Failed to join/leave hub:', err);
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('banner', file);

    try {
      setIsUploading(true);
      const token = localStorage.getItem('token');

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/hubs/${hubId}/upload-banner`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setBannerUrl(res.data.bannerUrl);
      toast({
        title: 'Banner updated',
        description: 'Your hub banner was updated successfully.',
      });
    } catch (err) {
      console.error('Banner upload failed:', err);
      toast({
        title: 'Error',
        description: 'Failed to upload banner image.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-700">
      {/* Banner */}
      <div className="relative h-48 bg-gray-900 flex items-center justify-center overflow-hidden">
        {bannerUrl1 ? (
          <img
            src={`${bannerUrl1}`}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        ) : (
          isCreator && (
            <div className="z-10 text-center">
              <ImagePlus className="w-6 h-6 mx-auto mb-1 text-gray-400" />
              <p className="text-sm text-gray-400">Add a banner image</p>
            </div>
          )
        )}
        <div className="absolute inset-0 bg-black opacity-40" />

        {isCreator && (
          <label className="absolute bottom-2 right-2 bg-gray-800 px-3 py-1 rounded shadow cursor-pointer text-sm font-medium flex items-center gap-2 border border-gray-600">
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4" /> Upload Banner
              </>
            )}
            <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
          </label>
        )}
      </div>

      {/* Hub Info */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{name}</h1>
              {isCreator && (
                <Badge className="bg-yellow-900/30 text-yellow-300 flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Creator
                </Badge>
              )}
            </div>
            <p className="text-gray-300 mb-4">{description}</p>

            <div className="flex items-center text-sm text-gray-400">
              <Users className="w-4 h-4 mr-1" />
              <span>{memberCount.toLocaleString()} members</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {!isCreator && (
              <Button
                onClick={handleJoinLeave}
                variant={isJoined ? 'outline' : 'default'}
                className={
                  isJoined
                    ? 'border-red-600 text-red-400 hover:bg-red-900/20'
                    : 'bg-blue-700 hover:bg-blue-600'
                }
              >
                {isJoined ? 'Leave Hub' : 'Join Hub'}
              </Button>
            )}

            {(isCreator || isJoined) && (
              <Button
                className="bg-green-700 hover:bg-green-600"
                onClick={() => navigate(`create-post`)}
              >
                Create Post
              </Button>
            )}

            {isCreator && (
              <Link to={`/hub/${hubId}/admin`}>
                <Button className="bg-yellow-600 hover:bg-yellow-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubHeader;
