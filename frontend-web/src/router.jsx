import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Habits from './pages/Habits';
import Profile from './pages/Profile';
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
          { path: routes.profile(), element: <Profile />, loader: profileLoader },
          { path: routes.errorTest(), element: <ErrorTest /> },
          { path: '*', element: <Navigate to={routes.dashboard()} replace /> },
        ],
      },
    ],
  },
]);
