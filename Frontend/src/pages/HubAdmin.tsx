import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { 
  Settings, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  Edit, 
  Trash2, 
  Crown,
  Eye,
  UserPlus,
  Ban,
  AlertTriangle,
  Clock,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { timeAgo } from '@/utils/timeAgo';
import CreateAnnouncementModal from '@/components/CreateAnnouncementModal';
import EditHubModal from '@/components/EditHubModal';
import EditRulesModal from '@/components/EditRulesModal';

const HubAdmin = () => {
  const { hubId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const [hubData, setHubData] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState(null);
  const [inviteLink, setInviteLink] = useState('');
  const [confirmingUserId, setConfirmingUserId] = useState(null);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [editModalOpenOverview, setEditModalOpenOverview] = useState(false);
  const [editModalOpenSettings, setEditModalOpenSettings] = useState(false);
  const [rulesModalOpen, setRulesModalOpen] = useState(false);

  const handleUpdateRules = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/hubs/${hubId}/rules`, 
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHubData(res.data);
      toast({ title: 'Rules Updated', description: 'Hub rules updated successfully.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update rules.' });
    }
  };

  const handleEditHubInfo = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/hubs/${hubId}/info`, 
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHubData(res.data);
      toast({ title: 'Hub Updated', description: 'Hub information updated successfully.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update hub.' });
    }
  };

  const handleCreateAnnouncement = async (content) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/hubs/${hubId}/announcements`, 
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: 'Announcement Created', description: 'Your announcement has been posted.' });
    } catch (err) {
      console.error('Failed to create announcement:', err);
      toast({ title: 'Error', description: 'Failed to create announcement.' });
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/hubs/${hubId}/recent-activities`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }})
        const data = await res.json();
        setActivities(data);
      } catch (err) {
        console.error('Failed to fetch activities', err);
      }
    };

    fetchActivities();
  }, [hubId]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [overviewRes, requestsRes, membersRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/hubs/${hubId}/admin/overview`, { headers }),
          axios.get(`http://localhost:5000/api/hubs/${hubId}/admin/join-requests`, { headers }),
          axios.get(`http://localhost:5000/api/hubs/${hubId}/admin/members`, { headers }),
        ]);

        setHubData(overviewRes.data);
        setJoinRequests(requestsRes.data || []);
        setMembers(membersRes.data || []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [hubId]);

  const handleRemoveUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/hubs/${hubId}/remove-member/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove from local state
      setMembers(prev => prev.filter(member => member._id !== userId));
      toast({
        title: "User Removed",
        description: "Member has been permanently removed from this hub.",
      });
    } catch (err) {
      console.error("Failed to remove user:", err);
      toast({
        title: "Error",
        description: "Failed to remove user from hub.",
      });
    } finally {
      setConfirmingUserId(null);
    }
  };

  const stats = [
    { label: 'Total Members', value: hubData?.totalMembers || 0, icon: Users, color: 'blue' },
    { label: 'Total Posts', value: hubData?.totalPosts || 0, icon: MessageSquare, color: 'green' },
    { label: 'Active Today', value: hubData?.activeMembers || 0, icon: BarChart3, color: 'purple' },
    { label: 'Pending Requests', value: hubData?.pendingJoinRequests || 0, icon: Clock, color: 'orange' }
  ];

  const handleJoinRequestAction = async (requestId, action, username) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/hubs/${hubId}/${action}/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJoinRequests(prev => prev.filter(r => r.id !== requestId));
      toast({
        title: `Request ${action}d!`,
        description: `${username}'s request has been ${action}d.`,
      });
    } catch (err) {
      console.error(`Failed to ${action} join request:`, err);
      toast({ title: 'Error', description: `Failed to ${action} join request.` });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-medium mb-2 text-white">Error loading hub data</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="border-gray-600 text-gray-200 hover:bg-gray-800">
              Retry
            </Button>
          </div>
        </main>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="space-y-6">
            <div className="h-12 w-64 bg-gray-700 rounded animate-pulse mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array(4).fill(0).map((_, i) => (
                <Card key={i} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="h-4 w-24 bg-gray-700 rounded animate-pulse mb-2"></div>
                        <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
                      </div>
                      <div className="p-3 rounded-full bg-gray-700 animate-pulse">
                        <div className="w-6 h-6"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              <h1 className="text-3xl font-bold text-white">Hub Admin Panel</h1>
            </div>
            <Badge className="bg-yellow-900/30 text-yellow-300">
              Creator
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              {hubData ? (
                <>
                  <h2 className="text-xl text-gray-300">{hubData.name}</h2>
                  <p className="text-sm text-gray-400">Created {timeAgo(hubData.createdAt)}</p>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Link to={`/hub/${hubId}`}>
                <Button variant="outline" className="border-gray-600 text-gray-200 hover:bg-gray-800">
                  <Eye className="w-4 h-4 mr-2" />
                  View Hub
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    stat.color === 'blue' ? 'bg-blue-900/30' :
                    stat.color === 'green' ? 'bg-green-900/30' :
                    stat.color === 'purple' ? 'bg-purple-900/30' :
                    'bg-orange-900/30'
                  }`}>
                    <stat.icon className={`w-6 h-6 ${
                      stat.color === 'blue' ? 'text-blue-400' :
                      stat.color === 'green' ? 'text-green-400' :
                      stat.color === 'purple' ? 'text-purple-400' :
                      'text-orange-400'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6 bg-gray-800">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="join-requests"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400"
            >
              Join Requests
            </TabsTrigger>
            <TabsTrigger 
              value="members"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400"
            >
              Members
            </TabsTrigger>
            <TabsTrigger 
              value="moderation"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400"
            >
              Moderation
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities?.posts?.map((post, index) => (
                      <div key={`post-${index}`} className="flex items-center justify-between py-2 border-b border-gray-700">
                        <span className="text-sm text-gray-400">New post: {post.title}</span>
                        <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleTimeString()}</span>
                      </div>
                    ))}

                    {activities?.polls?.map((poll, index) => (
                      <div key={`poll-${index}`} className="flex items-center justify-between py-2 border-b border-gray-700">
                        <span className="text-sm text-gray-400">Poll created: {poll.question}</span>
                        <span className="text-xs text-gray-500">{new Date(poll.createdAt).toLocaleTimeString()}</span>
                      </div>
                    ))}

                    {activities?.questions?.map((question, index) => (
                      <div key={`question-${index}`} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-400">Question asked: {question.text}</span>
                        <span className="text-xs text-gray-500">{new Date(question.createdAt).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => {
                      const link = `${window.location.origin}/hub/${hubId}`;
                      setInviteLink(link);
                      toast({
                        title: "Invite link generated",
                        description: "Share this link with users to invite them.",
                      });
                    }}
                    variant="outline" 
                    className="w-full justify-start border-gray-600 text-gray-200 hover:bg-gray-700"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Members
                  </Button>

                  {inviteLink && (
                    <div className="mt-3 p-3 rounded border border-gray-600 bg-gray-700/30 flex items-center justify-between">
                      <span className="text-sm text-gray-200 break-all">{inviteLink}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(inviteLink);
                          toast({
                            title: "Copied",
                            description: "Invite link copied to clipboard",
                          });
                        }}
                        className="ml-2 border-gray-600 text-gray-200 hover:bg-gray-700"
                      >
                        Copy
                      </Button>
                    </div>
                  )}
                  <Button 
                    onClick={() => setAnnouncementModalOpen(true)}
                    variant="outline" 
                    className="w-full justify-start border-gray-600 text-gray-200 hover:bg-gray-700"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Create Announcement
                  </Button>
                  <CreateAnnouncementModal
                    open={announcementModalOpen}
                    setOpen={setAnnouncementModalOpen}
                    onSubmit={handleCreateAnnouncement}
                  />
                  <Button onClick={()=>{setActiveTab("settings")}} variant="outline" className="w-full justify-start border-gray-600 text-gray-200 hover:bg-gray-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Hub Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="join-requests" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span>Pending Join Requests</span>
                  <Badge variant="outline" className="ml-1 border-gray-600 text-gray-200">
                    {joinRequests.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {joinRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <Clock className="w-10 h-10 text-gray-500" />
                    <p className="text-gray-400">No pending requests</p>
                    <p className="text-sm text-gray-500">When users request to join, they'll appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {joinRequests.map((request) => (
                      <div 
                        key={request.id || request._id || request.username}
                        className="border rounded-lg p-5 hover:shadow-sm transition-shadow border-gray-700 bg-gray-700/50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <div className="font-medium text-white">
                                  {request.username}
                                </div>
                                <Badge className="bg-orange-900/30 text-orange-300">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {request.submittedAt}
                                </Badge>
                              </div>
                            </div>

                            {request.message && (
                              <div className="bg-gray-700/50 p-3 rounded-md">
                                <p className="text-sm text-gray-300">{request.message}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-700">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-400 border-red-600 hover:bg-red-900/20"
                            onClick={() => handleJoinRequestAction(request._id, 'reject', request.username)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-700 hover:bg-green-600"
                            onClick={() => handleJoinRequestAction(request._id, 'approve', request.username)}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Members ({members.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div 
                      key={member._id} 
                      className="flex items-center justify-between py-2 border-b border-gray-700"
                    >
                      <div>
                        <span className="font-medium text-white">{member.username}</span>
                      </div>
                      <div className="flex gap-2">
                        {confirmingUserId === member._id ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-400 border-red-600 hover:bg-red-900/20"
                              onClick={() => handleRemoveUser(member._id)}
                            >
                              Confirm Remove
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-200 hover:bg-gray-700"
                              onClick={() => setConfirmingUserId(null)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-200 hover:bg-gray-700"
                            onClick={() => setConfirmingUserId(member._id)}
                          >
                            Remove User <Ban className="w-4 h-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Reported Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">No reported content at this time.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Hub Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant='outline'
                  className="w-full justify-start border-gray-600 text-gray-200 hover:bg-gray-700" 
                  onClick={() => setEditModalOpenSettings(true)} disabled={!hubData}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Hub
                </Button>

                <EditHubModal
                  open={editModalOpenSettings}
                  setOpen={setEditModalOpenSettings}
                  hubData={hubData}
                  onSubmit={handleEditHubInfo}
                />
                <Button 
                  variant="outline"
                  onClick={() => setRulesModalOpen(true)}
                  className="w-full justify-start border-gray-600 text-gray-200 hover:bg-gray-700"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Edit Hub Rules
                </Button>

                <EditRulesModal
                  open={rulesModalOpen}
                  setOpen={setRulesModalOpen}
                  hubData={hubData}
                  onSubmit={handleUpdateRules}
                />
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-400 border-red-600 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Hub
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HubAdmin;