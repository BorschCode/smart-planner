import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TitleManager from '../TitleManager.jsx';

export default function ShellLayout() {
  return (
    <div className="flex min-h-screen">
      <TitleManager />

      <Sidebar />

      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}
