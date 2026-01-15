import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, Calendar, User, Lock, AlertTriangle } from 'lucide-react';
import { useProfile } from '../../profile/profileContext.js';
import EmailVerificationBanner from '../../components/EmailVerificationBanner.jsx';
import FlashMessage from '../../components/FlashMessage.jsx';

export default function ProfileView() {
  /** @type UserDTO */
  const profile = useProfile();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const resendVerification = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setMessage({ type: 'success', text: 'Verification link sent to your inbox!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to send email. Try again later.' });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div className="p-10 text-center text-gray-500">Loading user profile...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <EmailVerificationBanner
          isVerified={!!profile.email_verified_at}
          onResend={resendVerification}
          loading={loading}
        />

        <FlashMessage message={message} />

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-32 bg-linear-to-r from-blue-600 to-indigo-700" />

          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="p-1.5 bg-white rounded-2xl shadow-md">
                <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                  <User size={48} />
                </div>
              </div>

              <div className="flex space-x-3 pb-2">
                <button
                  onClick={() => navigate('edit')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => navigate('security')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold"
                >
                  <Lock size={18} />
                  Security
                </button>
              </div>
            </div>

            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-gray-500">User ID: {profile.id}</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Info label="Email" value={profile.email} icon={<Mail size={16} />} />
              <Info
                label="Member Since"
                value={new Date(profile.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
                icon={<Calendar size={16} />}
              />

              <div className="p-4 bg-gray-50 rounded-xl border">
                <div className="flex items-center text-xs uppercase text-gray-400">
                  <ShieldCheck size={16} className="mr-2" />
                  Verification
                </div>
                <p className="font-bold">{profile.email_verified_at ? 'Verified' : 'Unverified'}</p>
              </div>

              <button
                onClick={() => navigate('email')}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Change Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, icon }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border space-y-1">
      <div className="flex items-center text-xs uppercase text-gray-400">
        {icon}
        <span className="ml-2">{label}</span>
      </div>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
