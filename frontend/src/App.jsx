import './App.css';
import { useEffect } from 'react';
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
import DashboardLayout from './pages/DashboardLayout';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import ProtectedRoute from './routeGuards/ProtectedRoute';
import RedirectIfAuthenticated from './routeGuards/RedirectIfAuthenticated';
import { useAuthStore } from './store/authStore';
import { useUserStore } from './store/userStore';
import CreatePost from './pages/blogpost/CreatePost';

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();
  // const { isCheckingAuth, getUserProfile, isAuthenticated, user } =
  //   useUserStore();

  // if (isCheckingAuth) return <div>Loading...</div>;

  // useEffect(() => {
  //   getUserProfile();
  // }, []);
  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) return <div>Loading...</div>;

  // console.log('isAuthenticated:', isAuthenticated);
  // console.log('user:', user);

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
              <RedirectIfAuthenticated>
                <Signup />
              </RedirectIfAuthenticated>
            }
          />

          <Route
            path="/signin"
            element={
              <RedirectIfAuthenticated>
                <SignIn />
              </RedirectIfAuthenticated>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="new-post" element={<CreatePost />} />
            {/* Add other sub-routes here later */}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
