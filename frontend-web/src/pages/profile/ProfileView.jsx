import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ShieldCheck, Calendar, User, Lock } from 'lucide-react';
import { useProfile } from '../../profile/profileContext';
import EmailVerificationBanner from '../../components/EmailVerificationBanner';
import FlashMessage from '../../components/FlashMessage';
import api from '../../api/axios';
import { routes } from '../../routes';
import { HttpStatusCode } from 'axios';

export default function ProfileView() {
  const profile = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const flash = location.state?.flash;
    if (flash) {
      setMessage(flash);
      window.history.replaceState({}, '');
    }
  }, [location.state?.flash]);

  const resendVerification = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await api.post(routes.emailNotification());
      setMessage({
        type: 'success',
        text: 'Verification email sent. Check your inbox.',
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err.response?.status === HttpStatusCode.UnprocessableEntity
            ? 'Too many attempts. Please wait.'
            : 'Failed to send verification email.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div className="p-10 text-center text-gray-500">Loading profile…</div>;
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
              <div className="relative group">
                <div className="p-1.5 bg-white rounded-2xl shadow-md">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border bg-gray-100 flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : profile.name ? (
                      <span className="text-2xl font-bold text-gray-500">
                        {getInitials(profile.name)}
                      </span>
                    ) : (
                      <User size={40} className="text-gray-400" />
                    )}

                    {/* Hover overlay */}
                    <button
                      onClick={() => navigate('update-avatar')}
                      className="absolute inset-0 bg-black/50 text-white text-sm font-semibold
                   opacity-0 group-hover:opacity-100 transition
                   flex items-center justify-center"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pb-2">
                <button
                  onClick={() => navigate('edit')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
                >
                  ✏️ Edit profile
                </button>

                <button
                  onClick={() => navigate('security')}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg font-semibold"
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
                label="Member since"
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
                <p className="font-bold">
                  {profile.email_verified_at ? 'Verified' : 'Not verified'}
                </p>
              </div>
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

function getInitials(name = '') {
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
