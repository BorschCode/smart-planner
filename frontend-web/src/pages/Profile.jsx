import React, { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, Calendar, User, Lock, Edit, AlertTriangle } from 'lucide-react';

export default function Profile() {
  /** @type UserDTO */
  const profile = useLoaderData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const resendVerification = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(r => setTimeout(r, 1000));
      setMessage({ type: 'success', text: 'Verification link sent to your inbox!' });
    } catch {
      // Removed 'e' to fix 'no-unused-vars' linting error
      setMessage({ type: 'error', text: 'Failed to send email. Try again later.' });
    } finally {
      setLoading(false);
    }
  };

  if (!profile)
    return <div className="p-10 text-center text-gray-500">Loading user profile...</div>;

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Verification Alert */}
        {!profile.email_verified_at && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="text-amber-600">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900">Email not verified</p>
                <p className="text-xs text-amber-700">
                  Please verify your email to secure your account.
                </p>
              </div>
            </div>
            <button
              onClick={resendVerification}
              disabled={loading}
              className="text-xs font-bold bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Sending...' : 'Resend Email'}
            </button>
          </div>
        )}

        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-32 bg-linear-to-r from-blue-600 to-indigo-700" />

          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="p-1.5 bg-white rounded-2xl shadow-md">
                <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                  <User size={48} strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex space-x-3 pb-2">
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit size={18} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => navigate('/profile/password')}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Lock size={18} />
                  <span>Security</span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-500 font-medium">User ID: {profile.id}</p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  <Mail size={16} className="mr-2" /> Email Address
                </div>
                <p className="text-gray-900 font-semibold">{profile.email}</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  <Calendar size={16} className="mr-2" /> Member Since
                </div>
                <p className="text-gray-900 font-semibold">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  <ShieldCheck size={16} className="mr-2" /> Verification Status
                </div>
                <div className="flex items-center">
                  {profile.email_verified_at ? (
                    <span className="text-green-600 font-bold">Verified Account</span>
                  ) : (
                    <span className="text-amber-600 font-bold">Unverified</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  <Lock size={16} className="mr-2" /> 2FA Status
                </div>
                <p
                  className={`font-bold ${profile.two_factor_confirmed_at ? 'text-indigo-600' : 'text-gray-500'}`}
                >
                  {profile.two_factor_confirmed_at ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
