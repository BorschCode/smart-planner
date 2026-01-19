import { createBrowserRouter, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TwoFactorChallenge from './pages/TwoFactorChallenge';
import EmailVerified from './pages/EmailVerified';

import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import HabitView from './pages/HabitView';
import ErrorTest from './pages/ErrorTest';

import ErrorPage from './error-page';

import AuthLayout from './layout/AuthLayout';
import ShellLayout from './layout/ShellLayout';
import ProtectedLayout from './layout/ProtectedLayout';

import ProfileLayout from './pages/profile/ProfileLayout.jsx';
import ProfileView from './pages/profile/ProfileView.jsx';
import ProfileEdit from './pages/profile/ProfileEdit.jsx';
import PasswordChange from './pages/profile/PasswordChange.jsx';
import TwoFactorSetup from './pages/profile/TwoFactorSetup.jsx';

import { routes } from './routes';
import { habitsLoader } from './loaders/habitsLoader';
import { habitLoader } from './loaders/habitLoader';
import { profileLoader } from './loaders/profileLoader.jsx';

export const router = createBrowserRouter([
  // =====================
  // PUBLIC / AUTH PAGES
  // =====================
  {
    element: <AuthLayout />,
    children: [
      { path: routes.login(), element: <Login /> },
      { path: routes.register(), element: <Register /> },
      { path: routes.forgotPassword(), element: <ForgotPassword /> },
      { path: routes.resetPassword(), element: <ResetPassword /> },
      { path: routes.twoFactorChallenge(), element: <TwoFactorChallenge /> },
      { path: routes.emailVerified(), element: <EmailVerified /> },
    ],
  },

  // =====================
  // AUTHENTICATED APP
  // =====================
  {
    element: <ShellLayout />,
    children: [
      {
        element: <ProtectedLayout />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: routes.dashboard(),
            element: <Dashboard />,
            handle: { title: 'Dashboard' },
          },

          {
            path: routes.habits(),
            element: <Habits />,
            loader: habitsLoader,
            handle: { title: 'Habits' },
          },

          {
            path: routes.habit(':id'),
            element: <HabitView />,
            loader: habitLoader,
          },

          {
            path: routes.profile(),
            element: <ProfileLayout />,
            loader: profileLoader,
            handle: { title: 'Profile' },
            children: [
              { index: true, element: <ProfileView /> },
              { path: 'edit', element: <ProfileEdit /> },
              { path: 'security', element: <PasswordChange /> },
              { path: 'two-factor', element: <TwoFactorSetup /> },
            ],
          },

          { path: routes.errorTest(), element: <ErrorTest /> },

          // fallback inside authenticated area
          { path: '*', element: <Navigate to={routes.dashboard()} replace /> },
        ],
      },
    ],
  },
]);
