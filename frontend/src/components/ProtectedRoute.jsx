import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = getCurrentUser();
  
  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/signin" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Wrong role, redirect to appropriate dashboard
    return <Navigate to={`/${user.role}/profile`} />;
  }

  return children;
};

export default ProtectedRoute;