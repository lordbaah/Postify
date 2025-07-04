import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { ToastContainer, toast } from 'react-toastify';
import Navbar from './components/layout/Navbar';
import Home from './pages/home/Home';
import Signup from './pages/SignUp';
import SignIn from './pages/SignIn';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/profile/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import NotFound from './pages/NotFound';

// Redirects authenticated and verified users to the profile page
const RedirectIfAuthenticatedAndVerified = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

// Redirects authenticated and verified users to the profile page
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  // Check if the user is logged in and verified
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  // if (isCheckingAuth) return <div>Loading...</div>;

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) return <div>Loading...</div>;

  console.log('isAuthenticated:', isAuthenticated);
  console.log('user:', user);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/signup"
            element={
              <RedirectIfAuthenticatedAndVerified>
                <Signup />
              </RedirectIfAuthenticatedAndVerified>
            }
          />

          <Route
            path="/signin"
            element={
              <RedirectIfAuthenticatedAndVerified>
                <SignIn />
              </RedirectIfAuthenticatedAndVerified>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
