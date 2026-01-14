import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { routes } from '../routes';

export default function ShellLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === routes.login();

  return (
    <div className="flex min-h-screen">
      {!isLoginPage && <Sidebar />}
      <main className={`flex-1 bg-gray-100 ${isLoginPage ? '' : 'p-6'}`}>
        <Outlet />
      </main>
    </div>
  );
}
