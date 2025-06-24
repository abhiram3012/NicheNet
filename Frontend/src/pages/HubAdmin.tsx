
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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

  // Mock admin data
  const hubData = {
    id: hubId,
    name: 'Photography',
    description: 'Share your best shots and learn new techniques from fellow photographers around the world.',
    memberCount: 15420,
    createdAt: '2024-01-15',
    totalPosts: 342,
    activeMembers: 89,
    pendingPosts: 5,
    reportedContent: 2,
    pendingJoinRequests: 8
  };

  const stats = [
    { label: 'Total Members', value: '15,420', icon: Users, color: 'blue' },
    { label: 'Total Posts', value: '342', icon: MessageSquare, color: 'green' },
    { label: 'Active Today', value: '89', icon: BarChart3, color: 'purple' },
    { label: 'Pending Requests', value: '8', icon: Clock, color: 'orange' }
  ];

  // Mock join requests data
  const joinRequests = [
    {
      id: '1',
      username: '@newphotographer',
      message: 'I\'m passionate about landscape photography and would love to share my work and learn from this community.',
      portfolioUrl: 'https://portfolio.example.com',
      experience: '5 years of amateur photography, specializing in nature and wildlife shots.',
      submittedAt: '2h ago',
      status: 'pending'
    },
    {
      id: '2',
      username: '@streetartist',
      message: 'Street photography enthusiast looking to connect with like-minded photographers and improve my skills.',
      portfolioUrl: 'https://streetphoto.example.com',
      experience: 'Professional photographer for 3 years, focusing on urban environments.',
      submittedAt: '4h ago',
      status: 'pending'
    },
    {
      id: '3',
      username: '@portraitlover',
      message: 'I specialize in portrait photography and would love to contribute to this community with tutorials and feedback.',
      portfolioUrl: '',
      experience: 'Self-taught photographer with 2 years experience in portrait work.',
      submittedAt: '1d ago',
      status: 'pending'
    }
  ];

  const recentMembers = [
    { username: '@newbie123', joinedAt: '2h ago', status: 'active' },
    { username: '@photoFan', joinedAt: '4h ago', status: 'active' },
    { username: '@artlover99', joinedAt: '1d ago', status: 'pending' }
  ];

  const pendingPosts = [
    { id: '1', title: 'Amazing sunset shot', author: '@newcomer', reportCount: 0 },
    { id: '2', title: 'Street photography tips', author: '@streetphoto', reportCount: 1 }
  ];

  const handleJoinRequestAction = (requestId: string, action: 'approve' | 'reject', username: string) => {
    toast({
      title: action === 'approve' ? "Request approved!" : "Request rejected",
      description: `${username}'s join request has been ${action}d.`,
    });
    // Here you would typically update the state or make an API call
  };

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
              <h2 className="text-xl text-gray-600">{hubData.name}</h2>
              <p className="text-sm text-gray-500">Created on {hubData.createdAt}</p>
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
            <TabsTrigger value="content">Content</TabsTrigger>
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
                  Pending Join Requests ({joinRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {joinRequests.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No pending join requests.</p>
                ) : (
                  <div className="space-y-6">
                    {joinRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{request.username}</h3>
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                <Clock className="w-3 h-3 mr-1" />
                                {request.submittedAt}
                              </Badge>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-1">Introduction Message:</h4>
                                <p className="text-gray-600 text-sm">{request.message}</p>
                              </div>
                              
                              {request.portfolioUrl && (
                                <div>
                                  <h4 className="font-medium text-sm text-gray-700 mb-1">Portfolio:</h4>
                                  <a 
                                    href={request.portfolioUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                  >
                                    {request.portfolioUrl}
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}
                              
                              <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-1">Experience:</h4>
                                <p className="text-gray-600 text-sm">{request.experience}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4 border-t">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleJoinRequestAction(request.id, 'approve', request.username)}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => handleJoinRequestAction(request.id, 'reject', request.username)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
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
                <CardTitle>Recent Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div>
                        <span className="font-medium">{member.username}</span>
                        <span className="text-sm text-gray-500 ml-2">joined {member.joinedAt}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                          {member.status}
                        </Badge>
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

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-gray-500">by {post.author}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Approve</Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
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
