import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api, { initCsrf } from '../api/axios';
import Logo from '../assets/sport-svgrepo-com.svg';
import { routes } from '../routes.js';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  const [email, setEmail] = useState(emailParam || '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await initCsrf();
      await api.post('/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate(routes.login(), { replace: true, state: { message: 'Пароль успішно змінено!' } });
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ email: ['Не вдалося скинути пароль. Можливо, посилання застаріло.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  const hasError = field => errors[field]?.length > 0;
  const getError = field => errors[field]?.[0];

  if (!token) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 sm:p-10 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Недійсне посилання
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Посилання для скидання паролю недійсне або застаріло.
          </p>
          <Link
            to={routes.forgotPassword()}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Запитати нове посилання
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 sm:p-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900 p-3 shadow">
            <img src={Logo} alt="Smart Tracker" className="w-12 h-12" draggable="false" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Новий пароль</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Введіть новий пароль для вашого акаунту
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`w-full rounded-lg border ${hasError('email') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              placeholder="your@email.com"
              required
            />
            {hasError('email') && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getError('email')}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Новий пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`w-full rounded-lg border ${hasError('password') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              placeholder="••••••••"
              required
            />
            {hasError('password') && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getError('password')}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password_confirmation"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Підтвердження паролю
            </label>
            <input
              id="password_confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={e => setPasswordConfirmation(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Зберігання...
              </span>
            ) : (
              'Змінити пароль'
            )}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            <Link
              to={routes.login()}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Повернутися до входу
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
