import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Plus, Bell, User, Settings, LogOut } from 'lucide-react';
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

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/signin');
  };

  // Debounced search effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchHubs = async () => {
        if (searchQuery.trim() === '') {
          setSearchResults([]);
          setShowDropdown(false);
          return;
        }

        try {
          const res = await axios.get(`http://localhost:5000/api/hubs/search?query=${searchQuery}`);
          setSearchResults(res.data);
          setShowDropdown(true);
        } catch (error) {
          console.error('Search error:', error);
        }
      };

      fetchHubs();
    }, 300); // Debounce delay

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleResultClick = (hubId) => {
    navigate(`/hub/${hubId}`);
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">HobbyHub</h1>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search hubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 transition-colors text-gray-900 dark:text-white"
            />
          </div>

          {/* Dropdown results */}
          {showDropdown && searchResults.length > 0 && (
            <ul className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-gray-900/50 w-full mt-1 rounded-md max-h-60 overflow-y-auto">
              {searchResults.map((hub) => (
                <li
                  key={hub._id}
                  onClick={() => handleResultClick(hub._id)}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
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
            className="relative text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 bg-white dark:bg-gray-800 border dark:border-gray-700"
            >
              <DropdownMenuItem asChild className="focus:bg-gray-100 dark:focus:bg-gray-700">
                <Link to="/profile" className="flex items-center text-gray-700 dark:text-gray-200">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="dark:border-gray-700" />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20"
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