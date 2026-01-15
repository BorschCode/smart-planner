import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import api from '../../api/axios';

export default function TwoFactorSetup() {
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState('initial'); // initial, setup, confirm, enabled
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [confirmCode, setConfirmCode] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const twoFactorEnabled = user?.two_factor_confirmed_at != null;

  useEffect(() => {
    if (twoFactorEnabled) {
      setStep('enabled');
    }
  }, [twoFactorEnabled]);

  const enableTwoFactor = async () => {
    setErrors({});
    setLoading(true);

    try {
      // First confirm password
      await api.post('/user/confirm-password', { password });

      // Enable 2FA
      await api.post('/user/two-factor-authentication');

      // Get QR code
      const qrResponse = await api.get('/user/two-factor-qr-code');
      setQrCode(qrResponse.data.svg);

      // Get secret key
      const secretResponse = await api.get('/user/two-factor-secret-key');
      setSecretKey(secretResponse.data.secretKey);

      setStep('confirm');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else if (err.response?.status === 423) {
        setErrors({ password: ['Невірний пароль'] });
      } else {
        setErrors({ general: ['Помилка активації 2FA'] });
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmTwoFactor = async () => {
    setErrors({});
    setLoading(true);

    try {
      const response = await api.post('/user/confirmed-two-factor-authentication', {
        code: confirmCode,
      });
      setRecoveryCodes(response.data.recovery_codes || []);
      await refreshUser();
      setStep('enabled');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || { code: ['Невірний код'] });
      } else {
        setErrors({ code: ['Невірний код автентифікації'] });
      }
    } finally {
      setLoading(false);
    }
  };

  const disableTwoFactor = async () => {
    setErrors({});
    setLoading(true);

    try {
      await api.post('/user/confirm-password', { password });
      await api.delete('/user/two-factor-authentication');
      await refreshUser();
      setStep('initial');
      setPassword('');
      setQrCode('');
      setSecretKey('');
      setRecoveryCodes([]);
    } catch (err) {
      if (err.response?.status === 423) {
        setErrors({ password: ['Невірний пароль'] });
      } else {
        setErrors({ general: ['Помилка вимкнення 2FA'] });
      }
    } finally {
      setLoading(false);
    }
  };

  const regenerateRecoveryCodes = async () => {
    setLoading(true);
    try {
      await api.post('/user/confirm-password', { password });
      const response = await api.post('/user/two-factor-recovery-codes');
      setRecoveryCodes(response.data || []);
    } catch (err) {
      if (err.response?.status === 423) {
        setErrors({ password: ['Введіть пароль для перегенерації кодів'] });
      }
    } finally {
      setLoading(false);
    }
  };

  const showRecoveryCodes = async () => {
    if (!password) {
      setErrors({ password: ['Введіть пароль для перегляду кодів'] });
      return;
    }
    setLoading(true);
    try {
      await api.post('/user/confirm-password', { password });
      const response = await api.get('/user/two-factor-recovery-codes');
      setRecoveryCodes(response.data || []);
    } catch (err) {
      if (err.response?.status === 423) {
        setErrors({ password: ['Невірний пароль'] });
      }
    } finally {
      setLoading(false);
    }
  };

  const hasError = field => errors[field]?.length > 0;
  const getError = field => errors[field]?.[0];

  // Initial state - 2FA not enabled
  if (step === 'initial') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Двофакторна автентифікація
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Додайте додатковий рівень безпеки до вашого акаунту за допомогою двофакторної
            автентифікації.
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                2FA не увімкнено
              </h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                Рекомендуємо увімкнути двофакторну автентифікацію для захисту вашого акаунту.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Підтвердіть пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`w-full rounded-lg border ${hasError('password') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white`}
              placeholder="••••••••"
            />
            {hasError('password') && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getError('password')}</p>
            )}
          </div>

          <button
            onClick={enableTwoFactor}
            disabled={loading || !password}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Увімкнення...' : 'Увімкнути 2FA'}
          </button>
        </div>
      </div>
    );
  }

  // Confirm step - scan QR and enter code
  if (step === 'confirm') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Налаштування 2FA</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Відскануйте QR-код за допомогою додатку автентифікації (Google Authenticator, Authy
            тощо)
          </p>
        </div>

        <div className="flex justify-center">
          <div
            className="p-4 bg-white rounded-lg shadow"
            dangerouslySetInnerHTML={{ __html: qrCode }}
          />
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Або введіть код вручну:</p>
          <code className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
            {secretKey}
          </code>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Код підтвердження
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              value={confirmCode}
              onChange={e => setConfirmCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className={`w-full rounded-lg border ${hasError('code') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white text-center text-2xl tracking-widest`}
              placeholder="000000"
              maxLength={6}
            />
            {hasError('code') && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getError('code')}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('initial')}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Скасувати
            </button>
            <button
              onClick={confirmTwoFactor}
              disabled={loading || confirmCode.length !== 6}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Підтвердження...' : 'Підтвердити'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enabled state
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Двофакторна автентифікація
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Керуйте налаштуваннями двофакторної автентифікації.
        </p>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
              2FA увімкнено
            </h3>
            <p className="mt-1 text-sm text-green-700 dark:text-green-300">
              Ваш акаунт захищено двофакторною автентифікацією.
            </p>
          </div>
        </div>
      </div>

      {recoveryCodes.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Коди відновлення
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Збережіть ці коди в безпечному місці. Кожен код можна використати лише один раз.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {recoveryCodes.map((code, index) => (
              <code
                key={index}
                className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-sm font-mono text-center"
              >
                {code}
              </code>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Пароль (для дій нижче)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={`w-full rounded-lg border ${hasError('password') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white`}
            placeholder="••••••••"
          />
          {hasError('password') && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getError('password')}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {recoveryCodes.length === 0 && (
            <button
              onClick={showRecoveryCodes}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Показати коди відновлення
            </button>
          )}
          <button
            onClick={regenerateRecoveryCodes}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Перегенерувати коди
          </button>
          <button
            onClick={disableTwoFactor}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            Вимкнути 2FA
          </button>
        </div>
      </div>
    </div>
  );
}
