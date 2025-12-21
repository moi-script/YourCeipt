// components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
const ProtectedRoute = () => {
  const { user, isAuth, isLoading } = useAuth(); // <--- Read the current user from Context
  const location = useLocation();

  // also attach the is loading here 



  // loading part when session is fetcing 
  if(isLoading) {
    return <h1>Fetching session</h1>
  }

  // If user is null, redirect to login
  if(!user) {
    return <Navigate to="/user" state={{ from: location }} replace />;
  } 

  return <Outlet />;
};

export default ProtectedRoute;