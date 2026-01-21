import { Link } from 'react-router-dom';
import Logo from '../assets/sport-svgrepo-com.svg';
import { routes } from '../routes.js';

export default function EmailVerified() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 sm:p-10">
        <div className="text-center flex flex-col items-center">
          <div className="mb-4 rounded-full bg-green-100 dark:bg-green-900 p-3 shadow">
            <svg
              className="w-12 h-12 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Email підтверджено!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Ваша електронна адреса успішно підтверджена. Тепер ви маєте повний доступ до всіх
            функцій.
          </p>

          <Link
            to={routes.home()}
            className="w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-center"
          >
            Перейти до дашборду
          </Link>
        </div>
      </div>
    </div>
  );
}
