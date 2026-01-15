import { AlertTriangle } from 'lucide-react';

export default function EmailVerificationBanner({ isVerified, onResend, loading }) {
  if (isVerified) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="text-amber-600" size={20} />
        <div>
          <p className="text-sm font-semibold text-amber-900">Email not verified</p>
          <p className="text-xs text-amber-700">Please verify your email to secure your account.</p>
        </div>
      </div>

      <button
        onClick={onResend}
        disabled={loading}
        className="text-xs font-bold bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Resend Email'}
      </button>
    </div>
  );
}
