import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import axios from 'axios';
import NicheNetLogo from './NicheNetLogo';
import { decodeJWT } from '@/utils/decodeJWT';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  // Get user ID (existing)
  const getCurrentUserId = (): string | null => {
    const token = localStorage.getItem("token");
    const decoded = token ? decodeJWT(token) : null;
    const currentUserId = decoded?._id || decoded?.id;
    return currentUserId || null;
  };

  // Get username (new)
  const getCurrentUsername = (): string | null => {
    const token = localStorage.getItem("token");
    const decoded = token ? decodeJWT(token) : null;
    return decoded?.username || null; // Adjust this key if your JWT uses a different field
  };

  useEffect(() => {
    const uname = getCurrentUsername();
    setUsername(uname);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/signin');
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchHubs = async () => {
        if (searchQuery.trim() === '') {
          setSearchResults([]);
          setShowDropdown(false);
          return;
        }

        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/hubs/search?query=${searchQuery}`);
          setSearchResults(res.data);
          setShowDropdown(true);
        } catch (error) {
          console.error('Search error:', error);
        }
      };

      fetchHubs();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleResultClick = (hubId: string) => {
    navigate(`/hub/${hubId}`);
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2">
          <NicheNetLogo width={36} height={36} />
          <span className="text-xl font-bold bg-gradient-to-r from-[#6A11CB] to-[#2575FC] bg-clip-text text-transparent">
            NicheNet
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search hubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 focus:bg-gray-800 text-white transition-colors"
            />
          </div>

          {showDropdown && searchResults.length > 0 && (
            <ul className="absolute z-50 bg-gray-800 border border-gray-700 shadow-md w-full mt-1 rounded-md max-h-60 overflow-y-auto">
              {searchResults.map((hub) => (
                <li
                  key={hub._id}
                  onClick={() => handleResultClick(hub._id)}
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                >
                  {hub.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative text-gray-300 hover:bg-gray-800"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full p-1 hover:bg-gray-800"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-medium uppercase">
                  {username ? username[0] : <User className="w-4 h-4 text-white" />}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 bg-gray-800 border border-gray-700"
            >
              <DropdownMenuItem asChild className="focus:bg-gray-700">
                <Link to="/profile" className="flex items-center text-gray-200">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="border-gray-700" />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-red-400 focus:bg-red-900/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
