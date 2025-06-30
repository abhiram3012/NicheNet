import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { decodeJWT } from '@/utils/decodeJWT';

const AdminProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { hubId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setIsLoading(false);

      const decoded = decodeJWT(token);
      const currentUserId = decoded?._id || decoded?.id;

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/hubs/${hubId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.creator === currentUserId) {
          setIsCreator(true);
        }
      } catch (err) {
        console.error('Failed to fetch hub info for admin check');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [hubId]);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!isCreator) return <Navigate to="/dashboard" />;

  return children;
};

export default AdminProtectedRoute;
