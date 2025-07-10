import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
// import { useUserStore } from '@/store/userStore';

const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  // const { isAuthenticated, user } = useUserStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/dashboard/profile" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;
