import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Habits from './pages/Habits';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import ErrorPage from './error-page';
import ShellLayout from './layout/ShellLayout';
import ProtectedLayout from './layout/ProtectedLayout';
import ErrorTest from './pages/ErrorTest.jsx';

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },

      {
        element: <ShellLayout />, // ← Sidebar only here
        errorElement: <ErrorPage />,
        children: [
          {
            element: <ProtectedLayout />, // ← auth gate
            errorElement: <ErrorPage />,
            children: [
              { path: '/', element: <Dashboard /> },
              { path: '/habits', element: <Habits /> },
              { path: '/profile', element: <Profile /> },
              { path: '/error-test', element: <ErrorTest /> },
              { path: '*', element: <Navigate to="/" replace /> },
            ],
          },
        ],
      },
    ],
  },
]);
