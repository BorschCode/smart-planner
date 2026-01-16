// src/layout/AuthLayout.jsx
import { Outlet } from 'react-router-dom';
import TitleManager from '../TitleManager.jsx';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <TitleManager />
      <Outlet />
    </div>
  );
}
