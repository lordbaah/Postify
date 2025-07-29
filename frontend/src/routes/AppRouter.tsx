import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { appRoutes } from './router';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import { useAuthStore } from '@/store/authStore';

const AppRouter = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 font-roboto">
        <p className="text-lg text-primary-DEFAULT">Loading application...</p>
      </div>
    );

  // console.log('isAuthenticated:', isAuthenticated);
  // console.log('user:', user);

  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map((route, index) => {
          const PageComponent = route.component;
          const LayoutComponent = route.layout || React.Fragment;

          // Create the base element with layout and page component
          const baseElement = (
            <LayoutComponent>
              <PageComponent />
            </LayoutComponent>
          );

          // Apply the appropriate wrapper based on route flags
          let wrappedElement = baseElement;

          if (route.isPublicOnly) {
            wrappedElement = <PublicOnlyRoute>{baseElement}</PublicOnlyRoute>;
          } else if (route.isAdminOnly) {
            // Admin routes should use AdminRoute wrapper, which typically includes auth check + admin check
            wrappedElement = <AdminRoute>{baseElement}</AdminRoute>;
          } else if (route.isProtected) {
            wrappedElement = <ProtectedRoute>{baseElement}</ProtectedRoute>;
          }

          return (
            <Route key={index} path={route.path} element={wrappedElement} />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
