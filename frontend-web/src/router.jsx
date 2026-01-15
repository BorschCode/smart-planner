import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TwoFactorChallenge from './pages/TwoFactorChallenge';
import EmailVerified from './pages/EmailVerified';
import Habits from './pages/Habits';
import Dashboard from './pages/Dashboard';
import ErrorPage from './error-page';
import ShellLayout from './layout/ShellLayout';
import ProtectedLayout from './layout/ProtectedLayout';
import ErrorTest from './pages/ErrorTest';
import { routes } from './routes';
import { habitsLoader } from './loaders/habitsLoader';
import { habitLoader } from './loaders/habitLoader';
import HabitView from './pages/HabitView';
import { profileLoader } from './loaders/profileLoader.jsx';
import ProfileLayout from './pages/profile/ProfileLayout.jsx';
import ProfileEdit from './pages/profile/ProfileEdit.jsx';
import PasswordChange from './pages/profile/PasswordChange.jsx';
import EmailChange from './pages/profile/EmailChange.jsx';
import ProfileView from './pages/profile/ProfileView.jsx';
import TwoFactorSetup from './pages/profile/TwoFactorSetup.jsx';

export const router = createBrowserRouter([
  {
    element: <ShellLayout />,
    children: [
      { path: routes.login(), element: <Login /> },
      { path: routes.register(), element: <Register /> },
      { path: routes.forgotPassword(), element: <ForgotPassword /> },
      { path: routes.resetPassword(), element: <ResetPassword /> },
      { path: routes.twoFactorChallenge(), element: <TwoFactorChallenge /> },
      { path: routes.emailVerified(), element: <EmailVerified /> },

      {
        element: <ProtectedLayout />,
        handle: { title: 'Habits' },
        errorElement: <ErrorPage />,
        children: [
          { path: routes.dashboard(), element: <Dashboard />, handle: { title: 'Dashboard' } },
          {
            path: routes.habits(),
            element: <Habits />,
            loader: habitsLoader,
            handle: { title: 'Habits' },
          },
          { path: routes.habit(':id'), element: <HabitView />, loader: habitLoader },
          {
            path: routes.profile(),
            element: <ProfileLayout />,
            handle: { title: 'Profile' },
            loader: profileLoader,
            children: [
              { index: true, element: <ProfileView />, handle: { title: 'Profile' } }, // /profile
              { path: 'edit', element: <ProfileEdit /> }, // /profile/edit
              { path: 'security', element: <PasswordChange /> }, // /profile/security
              { path: 'email', element: <EmailChange /> }, // /profile/email
              { path: 'two-factor', element: <TwoFactorSetup /> }, // /profile/two-factor
            ],
          },
          { path: routes.errorTest(), element: <ErrorTest /> },
          { path: '*', element: <Navigate to={routes.dashboard()} replace /> },
        ],
      },
    ],
  },
]);
