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
import { habitsLoader } from './loaders/habitsLoader.jsx';
import { habitLoader } from './loaders/habitLoader.jsx';
import HabitView from './pages/HabitView.jsx';

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,

    children: [
      // ---------- Public ----------
      {
        path: routes.login(),
        element: <Login />,
      },

      // ---------- Authenticated app ----------
      {
        element: <ShellLayout />, // Sidebar only here
        children: [
          {
            element: <ProtectedLayout />, // Auth gate
            children: [
              {
                path: routes.dashboard(),
                element: <Dashboard />,
              },
              {
                path: routes.habits(),
                element: <Habits />,
                loader: habitsLoader,
              },
              {
                path: routes.profile(),
                element: <Profile />,
              },
              {
                path: routes.errorTest(),
                element: <ErrorTest />,
              },
              {
                path: routes.habit(':id'),
                element: <HabitView />,
                loader: habitLoader,
              },
              {
                path: '*',
                element: <Navigate to={routes.dashboard()} replace />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
