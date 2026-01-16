import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import api from '../api/axios';
import Logo from '../assets/sport-svgrepo-com.svg';
import { routes } from '../routes.js';
import { HttpStatusCode } from 'axios';

export default function TwoFactorChallenge() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [code, setCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [useRecovery, setUseRecovery] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const payload = useRecovery ? { recovery_code: recoveryCode } : { code };
      await api.post('/two-factor-challenge', payload);
      await refreshUser();
      navigate(routes.dashboard(), { replace: true });
    } catch (err) {
      if (err.response?.status === HttpStatusCode.UnprocessableEntity) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({
          code: [useRecovery ? 'Невірний код відновлення' : 'Невірний код автентифікації'],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const hasError = field => errors[field]?.length > 0;
  const getError = field => errors[field]?.[0];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 sm:p-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900 p-3 shadow">
            <img src={Logo} alt="Smart Tracker" className="w-12 h-12" draggable="false" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Двофакторна автентифікація
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {useRecovery
              ? 'Введіть один з кодів відновлення'
              : 'Введіть код з додатку автентифікації'}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {!useRecovery ? (
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Код автентифікації
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className={`w-full rounded-lg border ${hasError('code') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl tracking-widest`}
                placeholder="000000"
                maxLength={6}
                required
              />
              {hasError('code') && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getError('code')}</p>
              )}
            </div>
          ) : (
            <div>
              <label
                htmlFor="recovery_code"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Код відновлення
              </label>
              <input
                id="recovery_code"
                type="text"
                value={recoveryCode}
                onChange={e => setRecoveryCode(e.target.value)}
                className={`w-full rounded-lg border ${hasError('recovery_code') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono`}
                placeholder="xxxxx-xxxxx"
                required
              />
              {hasError('recovery_code') && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {getError('recovery_code')}
                </p>
              )}
            </div>
          )}

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
                Перевірка...
              </span>
            ) : (
              'Підтвердити'
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setUseRecovery(!useRecovery);
                setCode('');
                setRecoveryCode('');
                setErrors({});
              }}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              {useRecovery ? 'Використати код автентифікації' : 'Використати код відновлення'}
            </button>
          </div>

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
