import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, ShieldCheck, Link as LinkIcon } from 'lucide-react';

interface Announcement {
  _id: string;
  content: string;
  author: { id: string; username: string };
  createdAt: string;
}

interface Hub {
  name: string;
  description: string;
  bannerUrl?: string;
  moderators?: string[];
  rules?: string[];
  announcements?: Announcement[];
  discordLink?: string;
  topContributors?: { username: string; posts: number }[];
  isCreator?: boolean;
  isJoined?: boolean;
}

interface HubSidebarProps {
  hubData: Hub;
}

const HubSidebar: React.FC<HubSidebarProps> = ({ hubData }) => {
  const { announcements = [], rules = [], discordLink } = hubData;

  return (
    <div className="space-y-6">
      {/* Announcements */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <Megaphone className="w-5 h-5 text-white" />
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="bg-gray-700/50 p-3 rounded-md"
                >
                  <p className="text-sm text-gray-300">{announcement.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    By {announcement.author.username} •{' '}
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No announcements yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rules */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <ShieldCheck className="w-5 h-5 text-white" />
            Community Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rules.length > 0 ? (
              rules.map((rule, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-sm font-medium text-blue-400 min-w-[20px]">
                    {index + 1}.
                  </span>
                  <span className="text-sm text-gray-300">{rule}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No rules set.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Discord Link */}
      {discordLink && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <LinkIcon className="w-5 h-5 text-white" />
              Discord Server
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={discordLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full text-center bg-blue-700 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Join on Discord
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HubSidebar;
