// components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import VideoLoader from './components/loaders/AnimatedLoader';

const ProtectedRoute = () => {
  const { user, isAuth, isLoading } = useAuth(); // <--- Read the current user from Context
  const location = useLocation();

  // also attach the is loading here 




  // loading part when session is fetcing 
  if(isLoading) {
    return <VideoLoader/>
  }

  // If user is null, redirect to login
  if(!user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }
  return <Outlet />
};

export default ProtectedRoute