import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/Login';
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
// import ProfileView from './pages/ProfileView.jsx';
import ProfileLayout from './pages/profile/ProfileLayout.jsx';
import ProfileEdit from './pages/profile/ProfileEdit.jsx';
import PasswordChange from './pages/profile/PasswordChange.jsx';
import EmailChange from './pages/profile/EmailChange.jsx';
import ProfileView from './pages/profile/ProfileView.jsx';

export const router = createBrowserRouter([
  {
    element: <ShellLayout />,
    children: [
      { path: routes.login(), element: <Login /> },

      {
        element: <ProtectedLayout />,
        errorElement: <ErrorPage />,
        children: [
          { path: routes.dashboard(), element: <Dashboard /> },
          { path: routes.habits(), element: <Habits />, loader: habitsLoader },
          { path: routes.habit(':id'), element: <HabitView />, loader: habitLoader },
          {
            path: routes.profile(),
            element: <ProfileLayout />,
            loader: profileLoader,
            children: [
              { index: true, element: <ProfileView /> },     // /profile
              { path: "edit", element: <ProfileEdit /> },    // /profile/edit
              { path: "security", element: <PasswordChange /> }, // /profile/security
              { path: "email", element: <EmailChange /> },   // /profile/email
            ]
          },
          { path: routes.errorTest(), element: <ErrorTest /> },
          { path: '*', element: <Navigate to={routes.dashboard()} replace /> },
        ],
      },
    ],
  },
]);
