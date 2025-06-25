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

const HubAdmin = () => {
  const { hubId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const [hubData, setHubData] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log(membersRes.data.length);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [hubId]);

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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-medium mb-2">Error loading hub data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="space-y-6">
            <div className="h-12 w-64 bg-gray-200 rounded animate-pulse mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array(4).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="p-3 rounded-full bg-gray-200 animate-pulse">
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              <h1 className="text-3xl font-bold text-gray-800">Hub Admin Panel</h1>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Creator
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              {hubData ? (
                <>
                  <h2 className="text-xl text-gray-600">{hubData.name}</h2>
                  <p className="text-sm text-gray-500">Created on {hubData.createdAt}</p>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Link to={`/hub/${hubId}`}>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Hub
                </Button>
              </Link>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Hub
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="join-requests">Join Requests</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">New member joined</span>
                      <span className="text-xs text-gray-400">2h ago</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">Post reported</span>
                      <span className="text-xs text-gray-400">4h ago</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">10 new posts created</span>
                      <span className="text-xs text-gray-400">1d ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Members
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Create Announcement
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Hub Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="join-requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span>Pending Join Requests</span>
                  <Badge variant="outline" className="ml-1">
                    {joinRequests.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {joinRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <Clock className="w-10 h-10 text-gray-400" />
                    <p className="text-gray-500">No pending requests</p>
                    <p className="text-sm text-gray-400">When users request to join, they'll appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {joinRequests.map((request) => (
                      <div 
                        key={request.id || request._id || request.username}
                        className="border rounded-lg p-5 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <div className="font-medium text-gray-900">
                                  {request.username}
                                </div>
                                <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {request.submittedAt}
                                </Badge>
                              </div>
                            </div>

                            {request.message && (
                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm text-gray-600">{request.message}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleJoinRequestAction(request._id, 'reject', request.username)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
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
            <Card>
              <CardHeader>
                <CardTitle>Members ({members.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member._id} className="flex items-center justify-between py-2">
                      <div>
                        <span className="font-medium">{member.username}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="default">Active</Badge>
                        <Button size="sm" variant="outline">
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Reported Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">No reported content at this time.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hub Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Hub Information
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
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