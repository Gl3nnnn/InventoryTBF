import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import EditUser from './pages/EditUser.jsx';
import UsersPage from './pages/UsersPage.jsx';

const Logs = lazy(() => import('./pages/Logs.jsx'));

// Simple auth check using token in localStorage
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  // Determine default page route based on localStorage preference
  const defaultPage = localStorage.getItem('defaultPage') || 'Dashboard';

  // Map default page name to route path
  const defaultPageRoute = (() => {
    switch (defaultPage) {
      case 'Dashboard':
        return '/dashboard';
      case 'Products':
        return '/products';
      case 'Reports':
        return '/reports';
      default:
        return '/dashboard';
    }
  })();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={<Navigate to={defaultPageRoute} replace />}
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <PrivateRoute>
              <ErrorBoundary>
                <Suspense fallback={<div>Loading...</div>}>
                  <Logs />
                </Suspense>
              </ErrorBoundary>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UsersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-user/:id"
          element={
            <PrivateRoute>
              <EditUser />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
