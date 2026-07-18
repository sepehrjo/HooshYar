'use client';

import {signIn} from 'next-auth/react';
import {useState, FormEvent, Suspense} from 'react';
import {useSearchParams} from 'next/navigation';
import Image from 'next/image';
import {useAdminLocale} from '@/hooks/useAdminLocale';

function LoginForm() {
  const {t, isRTL} = useAdminLocale();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        callbackUrl,
        redirect: false
      });

      console.log('Sign in result:', result);

      if (result?.error) {
        console.error('Sign in error:', result.error);
        setError(t('loginError'));
      } else {
        // NEVER use result.url — it's an absolute URL built by NextAuth's
        // detectOrigin(). Always use the relative callbackUrl directly.
        window.location.href = callbackUrl;
      }
    } catch (err) {
      console.error('Sign in exception:', err);
      setError(t('loginUnexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir={isRTL ? "rtl" : "ltr"}>
      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Animated Border Trace */}
        <div className="absolute inset-0 rounded-[20px] overflow-hidden">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                'linear-gradient(90deg, #3FE8F4 0%, #9D5CFF 50%, #E63CD8 100%)',
              animation: 'border-trace 4s linear infinite'
            }}
          />
          <div className="absolute inset-[1px] rounded-[19px] bg-[#05060F]" />
        </div>

        {/* Card Content */}
        <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-[20px] rounded-[20px] border border-[rgba(255,255,255,0.12)] p-8 shadow-2xl">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-full overflow-hidden mb-4 ring-2 ring-[rgba(63,232,244,0.3)]">
              <Image
                src="/images/Hoosh_Yar_Logo.jpeg"
                alt="Hoosh Yar Logo"
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <h1
              className="text-2xl font-bold text-center"
              style={{
                background:
                  'linear-gradient(135deg, #3FE8F4 0%, #9D5CFF 50%, #E63CD8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {t('loginTitle')}
            </h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#8A91B0] mb-2"
              >
                {t('username')}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border rounded-xl text-[#F2F4FF] placeholder-[#8A91B0] backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  error
                    ? 'border-[#E63CD8] focus:ring-[#E63CD8]/50'
                    : 'border-[rgba(255,255,255,0.12)] focus:ring-[#3FE8F4]/50 focus:border-[#3FE8F4]'
                }`}
                placeholder={t('loginUsernamePlaceholder')}
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#8A91B0] mb-2"
              >
                {t('password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border rounded-xl text-[#F2F4FF] placeholder-[#8A91B0] backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  error
                    ? 'border-[#E63CD8] focus:ring-[#E63CD8]/50'
                    : 'border-[rgba(255,255,255,0.12)] focus:ring-[#3FE8F4]/50 focus:border-[#3FE8F4]'
                }`}
                placeholder={t('loginPasswordPlaceholder')}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-[rgba(230,60,216,0.1)] border border-[#E63CD8] rounded-lg text-sm text-[#E63CD8] text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
              style={{
                background:
                  'linear-gradient(135deg, #3FE8F4 0%, #E63CD8 100%)'
              }}
            >
              {isLoading ? t('loginSubmitting') : t('loginButton')}
            </button>
          </form>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes border-trace {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
