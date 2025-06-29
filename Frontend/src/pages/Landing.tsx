import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, MessageCircle, Star, Zap, Shield, Heart, ArrowRight,
  Network, Camera, Music, Paintbrush, Lock, Code, Sparkles, ChevronRight
} from 'lucide-react';

const NicheNetLogo = ({ size = 64 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleMouseEnter = () => {
      if (!svgRef.current) return;
      const connections = svgRef.current.querySelectorAll('line');
      connections.forEach(line => {
        line.style.stroke = '#FFD700';
        line.style.strokeWidth = '3';
      });
    };

    const handleMouseLeave = () => {
      if (!svgRef.current) return;
      const connections = svgRef.current.querySelectorAll('line');
      connections.forEach(line => {
        line.style.stroke = 'white';
        line.style.strokeWidth = '2';
      });
    };

    const svgElement = svgRef.current;
    if (svgElement) {
      svgElement.addEventListener('mouseenter', handleMouseEnter);
      svgElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (svgElement) {
        svgElement.removeEventListener('mouseenter', handleMouseEnter);
        svgElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg 
        ref={svgRef}
        className={`logo-svg w-${size} h-${size}`}
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="mainGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#6A11CB"/>
            <stop offset="100%" stopColor="#2575FC"/>
          </radialGradient>
          
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background pulse */}
        <circle cx="100" cy="100" r="70" fill="url(#mainGradient)" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.7;0.9" dur="3s" repeatCount="indefinite"/>
        </circle>
        
        {/* Pulse rings */}
        <circle 
          cx="100" 
          cy="100" 
          r="45" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeDasharray="4,4" 
          opacity="0.7"
        >
          <animate attributeName="r" values="45;50;45" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite"/>
        </circle>
        
        <circle 
          cx="100" 
          cy="100" 
          r="30" 
          fill="none" 
          stroke="white" 
          strokeWidth="3" 
          opacity="0.8"
        >
          <animate attributeName="r" values="30;35;30" dur="3s" repeatCount="indefinite"/>
        </circle>
        
        {/* Network nodes */}
        <circle cx="100" cy="60" r="8" fill="white"/>
        <circle cx="140" cy="80" r="8" fill="white"/>
        <circle cx="130" cy="130" r="8" fill="white"/>
        <circle cx="70" cy="130" r="8" fill="white"/>
        <circle cx="60" cy="80" r="8" fill="white"/>
        
        {/* Connections with glow animation */}
        <g filter="url(#glow)">
          <line x1="100" y1="60" x2="140" y2="80" stroke="white" strokeWidth="2">
            <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0s"/>
          </line>
          <line x1="140" y1="80" x2="130" y2="130" stroke="white" strokeWidth="2">
            <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.2s"/>
          </line>
          <line x1="130" y1="130" x2="70" y2="130" stroke="white" strokeWidth="2">
            <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.4s"/>
          </line>
          <line x1="70" y1="130" x2="60" y2="80" stroke="white" strokeWidth="2">
            <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.6s"/>
          </line>
          <line x1="60" y1="80" x2="100" y2="60" stroke="white" strokeWidth="2">
            <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.8s"/>
          </line>
          <line 
            x1="100" 
            y1="100" 
            x2="100" 
            y2="60" 
            stroke="white" 
            strokeWidth="2" 
            strokeDasharray="5,2"
          >
            <animate attributeName="stroke-opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" begin="0s"/>
          </line>
        </g>
        
        {/* Central node with pulse */}
        <circle cx="100" cy="100" r="12" fill="white">
          <animate attributeName="r" values="12;14;12" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        
        {/* Additional particles */}
        <circle cx="80" cy="110" r="2" fill="white" opacity="0.7">
          <animate attributeName="cx" values="80;82;80" dur="1.8s" repeatCount="indefinite"/>
          <animate attributeName="cy" values="110;112;110" dur="2.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="120" cy="90" r="2" fill="white" opacity="0.7">
          <animate attributeName="cx" values="120;118;120" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="cy" values="90;88;90" dur="1.7s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>
  );
};

const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20"
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const Landing = () => {
  const features = [
    {
      icon: Users,
      title: 'Connect with Like-minded People',
      description: 'Join niche communities of passionate enthusiasts and make meaningful connections.'
    },
    {
      icon: MessageCircle,
      title: 'Share Your Passion',
      description: 'Post your creations, get feedback, and inspire others with your journey.'
    },
    {
      icon: Star,
      title: 'Discover New Interests',
      description: 'Explore trending hubs and find your next favorite niche community.'
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
    { name: 'Anime Lovers', members: '24.8K', icon: Sparkles, color: 'from-pink-500 to-purple-600' },
    { name: 'Photography Pros', members: '18.4K', icon: Camera, color: 'from-blue-500 to-cyan-500' },
    { name: 'Poetry Corner', members: '12.5K', icon: Music, color: 'from-yellow-500 to-orange-500' },
    { name: 'Gaming Legends', members: '32.7K', icon: Zap, color: 'from-green-500 to-emerald-500' },
    { name: 'Code Crafters', members: '28.1K', icon: Code, color: 'from-indigo-500 to-purple-500' },
    { name: 'Digital Artists', members: '15.9K', icon: Paintbrush, color: 'from-violet-500 to-fuchsia-500' }
  ];

  const stats = [
    { value: '500K+', label: 'Active Users' },
    { value: '10K+', label: 'Communities' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden">
      <ParticleBackground />
      
      {/* Header */}
      <header className="px-4 py-6 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Network className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">NicheNet</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="#">
              <button className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors">
                Sign In
              </button>
            </a>
            <a href="#">
              <motion.button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </motion.button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section with Logo */}
      <section className="px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div 
              className="w-full lg:w-1/2 flex justify-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <NicheNetLogo size={72} />
                <div className="absolute -top-6 -right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full">
                  Live Connections
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="w-full lg:w-1/2 text-center lg:text-left"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="mb-6">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-1 rounded-2xl inline-block">
                  <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium text-blue-300">
                    Community-Driven Interest Network
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Connect Through
                <span className="block mt-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Shared Passions
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-10">
                Join thousands of enthusiasts in micro-communities where your passions matter. 
                Share your creations, learn new skills, and connect with people who understand your niche.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#">
                  <motion.button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-xl flex items-center transition-all shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Join NicheNet Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.button>
                </a>
                <motion.button 
                  className="border border-gray-600 text-gray-300 text-lg px-8 py-4 rounded-xl transition-colors hover:bg-gray-700/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Communities
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-b from-gray-800/50 to-gray-900/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">NicheNet</span>?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              We've built the perfect platform for niche enthusiasts to thrive and connect.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-all border border-gray-700"
                whileHover={{ y: -5, borderColor: '#818cf8' }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl flex items-center justify-center mb-5">
                  <feature.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Hubs Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Popular <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Niche Communities</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Join thousands of passionate members in these thriving communities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularHubs.map((hub, index) => (
              <motion.div 
                key={index}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-all border border-gray-700"
                whileHover={{ y: -5, borderColor: '#818cf8' }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 bg-gradient-to-br ${hub.color} rounded-xl flex items-center justify-center`}>
                    <hub.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{hub.name}</h3>
                    <p className="text-gray-400 text-sm">{hub.members} members</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  Join passionate enthusiasts in the {hub.name} community to share, learn, and connect with others who share your interests.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800"></div>
                    ))}
                  </div>
                  <button className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    Join Community <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://assets-global.website-files.com/5f4ec532319820f7c2ccd7a3/65f9d3d5a8e2b5f8f4b7f9f0_Grid.svg')] bg-[length:100px] opacity-20"></div>
        
        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <div className="flex justify-center mb-8">
            <NicheNetLogo size={48} />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Niche?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join NicheNet today and connect with passionate people who share your specific interests.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#">
              <motion.button 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
            </a>
            <a href="#">
              <motion.button 
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-xl transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            </a>
          </div>

          <div className="mt-10 p-4 bg-white/10 rounded-xl inline-block backdrop-blur-sm">
            <p className="text-sm opacity-90 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> 
              No email required • Privacy-focused • Always free to join
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-gray-900/80 backdrop-blur-sm text-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Network className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">NicheNet</h1>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Communities</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© 2024 NicheNet. Built for passionate niche enthusiasts worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;