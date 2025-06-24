
import React from 'react';
import Navbar from '@/components/Navbar';
import UserProfileHeader from '@/components/UserProfileHeader';
import UserBadges from '@/components/UserBadges';
import ActivityHeatmap from '@/components/ActivityHeatmap';
import UserHubs from '@/components/UserHubs';
import UserActivity from '@/components/UserActivity';

const Profile = () => {
  // Mock user data - in a real app this would come from an API
  const userData = {
    id: 'user-123',
    username: 'HobbyEnthusiast42',
    isAnonymous: false,
    avatar: '/placeholder.svg',
    bio: 'Passionate about photography, gardening, and sharing knowledge with fellow hobbyists. Always learning something new!',
    karma: 2847,
    joinedDate: '2024-01-15',
    currentStreak: 12,
    longestStreak: 28,
    badges: [
      { id: 'first-post', name: 'First Post', description: 'Made your first post!', icon: '📝', earned: true },
      { id: 'hundred-karma', name: '100+ Karma', description: 'Reached 100 karma points', icon: '💯', earned: true },
      { id: 'top-contributor', name: 'Top Contributor', description: 'One of the most active members this month', icon: '⭐', earned: true },
      { id: 'helpful-commenter', name: 'Helpful Commenter', description: 'Received 50+ upvotes on comments', icon: '💬', earned: true },
      { id: 'streak-master', name: 'Streak Master', description: '7-day activity streak', icon: '🔥', earned: true },
      { id: 'hub-explorer', name: 'Hub Explorer', description: 'Joined 5+ different hubs', icon: '🗺️', earned: true }
    ],
    joinedHubs: [
      { id: 'photography', name: 'Photography Hub', role: 'Top Commentator', karma: 856 },
      { id: 'gardening', name: 'Urban Gardening', role: 'Contributor', karma: 423 },
      { id: 'cooking', name: 'Home Cooking', role: 'New Member', karma: 67 },
      { id: 'books', name: 'Book Club', role: 'Discussion Leader', karma: 234 }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <UserProfileHeader userData={userData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <UserBadges badges={userData.badges} />
            <ActivityHeatmap userId={userData.id} />
            <UserActivity userId={userData.id} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <UserHubs hubs={userData.joinedHubs} currentStreak={userData.currentStreak} longestStreak={userData.longestStreak} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
