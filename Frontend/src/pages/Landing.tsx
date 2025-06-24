import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageCircle, Star, Zap, Shield, Heart, ArrowRight } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Users,
      title: 'Connect with Like-minded People',
      description: 'Join communities of passionate hobby enthusiasts and make meaningful connections.'
    },
    {
      icon: MessageCircle,
      title: 'Share Your Passion',
      description: 'Post your creations, get feedback, and inspire others with your hobby journey.'
    },
    {
      icon: Star,
      title: 'Discover New Interests',
      description: 'Explore trending hubs and find your next favorite hobby or creative outlet.'
    },
    {
      icon: Zap,
      title: 'Real-time Engagement',
      description: 'Stay updated with live discussions and see who\'s active in your communities.'
    },
    {
      icon: Shield,
      title: 'Privacy Focused',
      description: 'Your privacy matters. Stay anonymous if you want - no email required to get started.'
    },
    {
      icon: Heart,
      title: 'Supportive Community',
      description: 'Experience a welcoming environment where everyone\'s passion is celebrated.'
    }
  ];

  const popularHubs = [
    { name: 'Photography', members: '15.4K', color: 'from-purple-500 to-pink-500' },
    { name: 'Digital Art', members: '12.8K', color: 'from-blue-500 to-cyan-500' },
    { name: 'Cooking', members: '18.5K', color: 'from-orange-500 to-red-500' },
    { name: 'Hiking', members: '9.8K', color: 'from-green-500 to-emerald-500' },
    { name: 'Code Crafters', members: '23.1K', color: 'from-indigo-500 to-purple-500' },
    { name: 'Poetry Corner', members: '8.2K', color: 'from-pink-500 to-rose-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">HobbyHub</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/signin">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Connect Through
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Shared Passions</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of hobby enthusiasts in a community where your passions matter. 
            Share your creations, learn new skills, and connect with people who understand your interests.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Join HobbyHub Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Explore Communities
            </Button>
          </div>

          {/* Popular Hubs Preview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {popularHubs.map((hub, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${hub.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                    <span className="text-white font-bold">{hub.name[0]}</span>
                  </div>
                  <h3 className="font-semibold text-sm text-gray-800">{hub.name}</h3>
                  <p className="text-xs text-gray-500">{hub.members} members</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose HobbyHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built the perfect platform for hobby enthusiasts to thrive and connect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-gray-50">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Find Your Tribe?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join HobbyHub today and connect with passionate people who share your interests.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Create Free Account
              </Button>
            </Link>
            <Link to="/signin">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-white/10 rounded-lg inline-block">
            <p className="text-sm opacity-90">
              🔒 No email required • Privacy-focused • Always free to join
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold">HobbyHub</span>
          </div>
          <p className="text-gray-400">
            © 2024 HobbyHub. Built for passionate hobby enthusiasts worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;