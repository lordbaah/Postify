import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
// import { useUserStore } from '@/store/userStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  // const { isAuthenticated, user } = useUserStore();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

export default ProtectedRoute;
