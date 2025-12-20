// components/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
const ProtectedRoute = () => {
  const { user, isAuth } = useAuth(); // <--- Read the current user from Context
  const location = useLocation();

  // also attach the is loading here 


  // needs to auto fetch the data when refresh so it wont have


  useEffect(() => {
    // fetch 
  }, [])



  // If user is null, redirect to login
  if(!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  } 
//   if (!user) {
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

  return <Outlet />;
};

export default ProtectedRoute;