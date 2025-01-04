import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthenticator();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // If there's no user, don't render the children
  if (!user) {
    return null;
  }

  // If there is a user, render the children
  return children;
};

export default ProtectedRoute; 