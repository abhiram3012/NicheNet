import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Star, User, Lock, Pencil, Users, PlusCircle, Check, X } from 'lucide-react';

interface Hub {
  _id: string;
  name: string;
  description: string;
  memberCount: number;
  postCount?: number;
}

interface UserData {
  username: string;
  avatar: string;
  bio?: string;
  createdAt: string;
  karma: number;
  createdHubs: Hub[];
  joinedHubs: Hub[];
}

const Profile = () => {
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [newUsername, setNewUsername] = React.useState('');
  const [newBio, setNewBio] = React.useState('');
  const [passwordData, setPasswordData] = React.useState({ current: '', new: '', confirm: '' });
  
  // State for feedback messages
  const [usernameStatus, setUsernameStatus] = React.useState<{success: boolean, message: string} | null>(null);
  const [bioStatus, setBioStatus] = React.useState<{success: boolean, message: string} | null>(null);
  const [passwordStatus, setPasswordStatus] = React.useState<{success: boolean, message: string} | null>(null);
  const [isUpdating, setIsUpdating] = React.useState({username: false, bio: false, password: false});

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        }});
        const data = await res.json();
        setUserData(data);
        setNewUsername(data.username);
        setNewBio(data.bio || '');
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, []);

  const formatJoinDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  const handleUsernameChange = async () => {
    if (!newUsername.trim() || isUpdating.username) return;
    setIsUpdating(prev => ({...prev, username: true}));
    setUsernameStatus(null);
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/me/username', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ username: newUsername }),
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Failed to update username');
      
      const updated = await res.json();
      setUserData((prev) => prev ? {...prev, username: updated.username} : null);
      setUsernameStatus({success: true, message: 'Username updated successfully!'});
    } catch (err) {
      console.error(err);
      setUsernameStatus({success: false, message: err.message || 'Failed to update username'});
    } finally {
      setIsUpdating(prev => ({...prev, username: false}));
    }
  };

  const handlePasswordChange = async () => {
    const { current, new: newPass, confirm } = passwordData;
    if (!current || !newPass || isUpdating.password) return;
    
    if (newPass !== confirm) {
      setPasswordStatus({success: false, message: 'New passwords do not match'});
      return;
    }
    
    setIsUpdating(prev => ({...prev, password: true}));
    setPasswordStatus(null);
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
        credentials: 'include',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update password');
      }
      
      setPasswordData({ current: '', new: '', confirm: '' });
      setPasswordStatus({success: true, message: 'Password updated successfully!'});
    } catch (err) {
      console.error(err);
      setPasswordStatus({success: false, message: err.message || 'Failed to update password'});
    } finally {
      setIsUpdating(prev => ({...prev, password: false}));
    }
  };

  const handleBioUpdate = async () => {
    if (isUpdating.bio) return;
    setIsUpdating(prev => ({...prev, bio: true}));
    setBioStatus(null);
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/me/bio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ bio: newBio }),
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Failed to update bio');
      
      setUserData((prev) => prev ? {...prev, bio: newBio} : null);
      setBioStatus({success: true, message: 'Bio updated successfully!'});
    } catch (err) {
      console.error(err);
      setBioStatus({success: false, message: err.message || 'Failed to update bio'});
    } finally {
      setIsUpdating(prev => ({...prev, bio: false}));
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Profile & Settings</h1>

        {/* Profile Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
            <CardDescription>Your profile information and account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex flex-col items-center">
                <Avatar className="w-20 h-20 border-2 border-gray-200">
                  <AvatarImage src={userData.avatar} alt={userData.username} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                    {userData.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="w-4 h-4" />
                  <span>{userData.karma.toLocaleString()} Karma</span>
                </div>
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <h2 className="text-2xl font-bold">{userData.username}</h2>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {formatJoinDate(userData.createdAt)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">About</h3>
                  <div className="relative">
                    <textarea
                      className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                      value={newBio}
                      onChange={(e) => setNewBio(e.target.value)}
                      placeholder="Tell others about yourself..."
                    />
                    <div className="flex justify-between mt-2">
                      <div className="flex items-center">
                        {bioStatus && (
                          <span className={`flex items-center text-sm ${bioStatus.success ? 'text-green-500' : 'text-destructive'}`}>
                            {bioStatus.success ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                            {bioStatus.message}
                          </span>
                        )}
                      </div>
                      <Button 
                        onClick={handleBioUpdate}
                        disabled={isUpdating.bio}
                        size="sm"
                        className="ml-auto"
                      >
                        {isUpdating.bio ? (
                          <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Updating...
                          </span>
                        ) : 'Update About'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hubs Created */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Hubs Created
            </CardTitle>
            <CardDescription>Communities you've created and manage</CardDescription>
          </CardHeader>
          <CardContent>
            {userData.createdHubs.length === 0 ? (
              <p className="text-muted-foreground italic py-4">You haven't created any hubs yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.createdHubs.map((hub) => (
                  <div key={hub._id} className="border rounded-lg p-4 hover:bg-accent transition-colors group">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{hub.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{hub.description}</p>
                    <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                      <span>{hub.memberCount.toLocaleString()} members</span>
                      <span>{hub.postCount || 0} posts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hubs Joined */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Hubs Joined
            </CardTitle>
            <CardDescription>Communities you're participating in</CardDescription>
          </CardHeader>
          <CardContent>
            {userData.joinedHubs.length === 0 ? (
              <p className="text-muted-foreground italic py-4">You haven't joined any hubs yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.joinedHubs.map((hub) => (
                  <div key={hub._id} className="border rounded-lg p-4 hover:bg-accent transition-colors group">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{hub.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{hub.description}</p>
                    <div className="mt-3 text-xs text-muted-foreground">
                      {hub.memberCount.toLocaleString()} members
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Username Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pencil className="w-5 h-5" />
              Change Username
            </CardTitle>
            <CardDescription>Update your display name</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-username">New Username</Label>
              <Input
                id="new-username"
                placeholder="Enter new username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            
            <div className="flex items-center">
              <Button 
                onClick={handleUsernameChange}
                disabled={isUpdating.username}
              >
                {isUpdating.username ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Updating...
                  </span>
                ) : 'Update Username'}
              </Button>
              
              {usernameStatus && (
                <span className={`ml-4 flex items-center text-sm ${usernameStatus.success ? 'text-green-500' : 'text-destructive'}`}>
                  {usernameStatus.success ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                  {usernameStatus.message}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </CardTitle>
            <CardDescription>Secure your account with a new password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.new}
                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
              />
            </div>
            
            <div className="flex items-center">
              <Button 
                onClick={handlePasswordChange}
                disabled={isUpdating.password}
              >
                {isUpdating.password ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Updating...
                  </span>
                ) : 'Update Password'}
              </Button>
              
              {passwordStatus && (
                <span className={`ml-4 flex items-center text-sm ${passwordStatus.success ? 'text-green-500' : 'text-destructive'}`}>
                  {passwordStatus.success ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                  {passwordStatus.message}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

