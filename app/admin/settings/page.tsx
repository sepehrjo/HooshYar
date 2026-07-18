'use client';

import {useCallback, useEffect, useState} from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import {ConfirmModal} from '@/components/admin/ConfirmModal';
import {useToast} from '@/components/admin/Toast';
import {useAdminLocale} from '@/hooks/useAdminLocale';
import {cn} from '@/lib/utils';

interface SocialForm {
  instagram: string;
  telegram: string;
  whatsapp: string;
  bale: string;
  email: string;
  contactEmail: string;
}

type DangerAction = 'clear-chat-logs' | 'reset-content' | null;

const inputClass =
  'w-full px-4 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] rounded-lg text-[#F2F4FF] placeholder:text-[#8A91B0]/60 focus:outline-none focus:border-[rgba(63,232,244,0.4)] transition-colors text-sm';

function SettingsSection({
  title,
  children,
  danger,
}: {
  title: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <section
      className={cn(
        'bg-[rgba(255,255,255,0.04)] backdrop-blur-sm rounded-xl border p-6',
        danger
          ? 'border-[rgba(230,60,216,0.25)]'
          : 'border-[rgba(255,255,255,0.12)]'
      )}
    >
      <h2
        className={cn(
          'text-lg font-semibold mb-5',
          danger ? 'text-[#E63CD8]' : 'text-[#F2F4FF]'
        )}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function DemoModeToggle({
  enabled,
  onChange,
  disabled,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative w-16 h-8 rounded-full transition-colors duration-200 disabled:opacity-50',
        enabled ? 'bg-[rgba(255,140,0,0.4)]' : 'bg-[rgba(63,232,244,0.3)]'
      )}
    >
      <span
        className={cn(
          'absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all duration-200',
          enabled ? 'start-9' : 'start-1'
        )}
      />
    </button>
  );
}

function StatusDot({connected}: {connected: boolean}) {
  return (
    <span
      className={cn(
        'inline-block w-2.5 h-2.5 rounded-full',
        connected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
      )}
    />
  );
}

export default function SettingsPage() {
  const {t, isRTL} = useAdminLocale();
  const {showToast, ToastContainer} = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [isTogglingDemo, setIsTogglingDemo] = useState(false);
  const [social, setSocial] = useState<SocialForm>({
    instagram: '',
    telegram: '',
    whatsapp: '',
    bale: '',
    email: '',
    contactEmail: '',
  });
  const [isSavingSocial, setIsSavingSocial] = useState(false);

  const [groqMasked, setGroqMasked] = useState<string | null>(null);
  const [groqConfigured, setGroqConfigured] = useState(false);
  const [groqStatus, setGroqStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [groqError, setGroqError] = useState('');
  const [kvConnected, setKvConnected] = useState(false);

  const [dangerAction, setDangerAction] = useState<DangerAction>(null);
  const [isDangerLoading, setIsDangerLoading] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();

      setDemoMode(data.demoMode ?? false);
      setSocial({
        instagram: data.social?.instagram ?? '',
        telegram: data.social?.telegram ?? '',
        whatsapp: data.social?.whatsapp ?? '',
        bale: data.social?.bale ?? '',
        email: data.social?.email ?? '',
        contactEmail: data.contactEmail ?? '',
      });
      setGroqMasked(data.groq?.masked ?? null);
      setGroqConfigured(data.groq?.configured ?? false);
      setKvConnected(data.kv?.connected ?? false);
    } catch {
      showToast(t('errorOccurred'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast, t]);

  useEffect(() => {
    void fetchSettings();
  }, []);

  const handleDemoToggle = async (enabled: boolean) => {
    setIsTogglingDemo(true);
    try {
      const res = await fetch('/api/admin/demo-mode', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({enabled}),
      });
      if (!res.ok) throw new Error('Failed');
      setDemoMode(enabled);
      showToast(enabled ? t('demoModeEnabled') : t('demoModeDisabled'), 'success');
      window.dispatchEvent(new CustomEvent('demo-mode-changed'));
    } catch {
      showToast(t('errorOccurred'), 'error');
    } finally {
      setIsTogglingDemo(false);
    }
  };

  const handleSaveSocial = async () => {
    setIsSavingSocial(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(social),
      });
      if (!res.ok) throw new Error('Failed');
      showToast(t('changesSaved'), 'success');
    } catch {
      showToast(t('errorOccurred'), 'error');
    } finally {
      setIsSavingSocial(false);
    }
  };

  const handleTestGroq = async () => {
    setGroqStatus('testing');
    setGroqError('');
    try {
      const res = await fetch('/api/admin/test-groq');
      const data = await res.json();
      if (data.success) {
        setGroqStatus('success');
      } else {
        setGroqStatus('error');
        setGroqError(data.error ?? t('connectionFailed'));
      }
    } catch {
      setGroqStatus('error');
      setGroqError(t('connectionFailed'));
    }
  };

  const handleDangerConfirm = async () => {
    if (!dangerAction) return;
    setIsDangerLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action: dangerAction}),
      });
      if (!res.ok) throw new Error('Failed');
      showToast(
        dangerAction === 'clear-chat-logs' ? t('chatLogsCleared') : t('contentReset'),
        'success'
      );
      setDangerAction(null);
    } catch {
      showToast(t('errorOccurred'), 'error');
    } finally {
      setIsDangerLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#8A91B0]">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <ToastContainer />

      <div className={isRTL ? 'text-right' : 'text-left'}>
        <h1 className="text-3xl font-bold text-[#F2F4FF] mb-2">{t('settings')}</h1>
        <p className="text-[#8A91B0]">{t('settingsSubtitle')}</p>
      </div>

      {/* Demo Mode */}
      <SettingsSection title={t('demoMode')}>
        <div className="flex items-center gap-5">
          <DemoModeToggle
            enabled={demoMode}
            onChange={handleDemoToggle}
            disabled={isTogglingDemo}
          />
          <div className="flex-1">
            <p className="text-sm text-[#8A91B0] leading-relaxed">
              {t('demoModeDescription')}
            </p>
            {demoMode && (
              <p className="text-sm text-orange-400 mt-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {t('demoModeActive')}
              </p>
            )}
          </div>
        </div>
      </SettingsSection>

      {/* Social Links & Contact */}
      <SettingsSection title={t('socialLinks')}>
        <div className="space-y-4">
          {(
            [
              ['instagram', t('instagram')],
              ['telegram', t('telegram')],
              ['whatsapp', t('whatsapp')],
              ['bale', t('bale')],
              ['email', t('emailField')],
              ['contactEmail', t('contactEmail')],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-[#8A91B0] mb-1.5">
                {label}
              </label>
              <input
                type="text"
                value={social[key]}
                onChange={e =>
                  setSocial(prev => ({...prev, [key]: e.target.value}))
                }
                className={inputClass}
                dir="ltr"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={handleSaveSocial}
            disabled={isSavingSocial}
            className="mt-2 px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#3FE8F4] to-[#9D5CFF] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSavingSocial ? t('loading') : t('saveAll')}
          </button>
        </div>
      </SettingsSection>

      {/* API Status */}
      <SettingsSection title={t('apiStatus')}>
        <div className="space-y-5">
          {/* Groq */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[rgba(255,255,255,0.02)] rounded-lg">
            <div>
              <div className="text-sm font-medium text-[#F2F4FF] mb-1">
                {t('groqApi')}
              </div>
              {groqConfigured && groqMasked ? (
                <code className="text-xs text-[#8A91B0] font-mono" dir="ltr">
                  {groqMasked}
                </code>
              ) : (
                <span className="text-xs text-[#8A91B0]">{t('groqKeyNotSet')}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {groqStatus === 'success' && (
                <span className="text-sm text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {t('connected')}
                </span>
              )}
              {groqStatus === 'error' && (
                <span className="text-sm text-[#E63CD8] flex items-center gap-1">
                  ❌ {groqError || t('connectionFailed')}
                </span>
              )}
              <button
                type="button"
                onClick={handleTestGroq}
                disabled={!groqConfigured || groqStatus === 'testing'}
                className="px-4 py-2 text-sm border border-[rgba(63,232,244,0.3)] text-[#3FE8F4] rounded-lg hover:bg-[rgba(63,232,244,0.1)] transition-colors disabled:opacity-50"
              >
                {groqStatus === 'testing' ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('testing')}
                  </span>
                ) : (
                  t('testConnection')
                )}
              </button>
            </div>
          </div>

          {/* Vercel KV */}
          <div className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.02)] rounded-lg">
            <div className="text-sm font-medium text-[#F2F4FF]">Vercel KV</div>
            <div className="flex items-center gap-2">
              <StatusDot connected={kvConnected} />
              <span className="text-sm text-[#8A91B0]">
                {kvConnected ? t('kvConnected') : t('kvDisconnected')}
              </span>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Danger Zone */}
      <SettingsSection title={t('dangerZone')} danger>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setDangerAction('clear-chat-logs')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#F2F4FF] bg-[rgba(230,60,216,0.08)] border border-[rgba(230,60,216,0.2)] rounded-lg hover:bg-[rgba(230,60,216,0.12)] transition-colors"
          >
            <Trash2 className="w-4 h-4 text-[#E63CD8]" />
            {t('clearChatLogs')}
          </button>
          <button
            type="button"
            onClick={() => setDangerAction('reset-content')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#F2F4FF] bg-[rgba(230,60,216,0.08)] border border-[rgba(230,60,216,0.2)] rounded-lg hover:bg-[rgba(230,60,216,0.12)] transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-[#E63CD8]" />
            {t('resetContent')}
          </button>
        </div>
      </SettingsSection>

      <ConfirmModal
        isOpen={dangerAction === 'clear-chat-logs'}
        title={t('clearChatLogs')}
        message={t('clearChatLogsConfirm')}
        onConfirm={handleDangerConfirm}
        onCancel={() => setDangerAction(null)}
        isLoading={isDangerLoading}
      />

      <ConfirmModal
        isOpen={dangerAction === 'reset-content'}
        title={t('resetContent')}
        message={t('resetContentConfirm')}
        onConfirm={handleDangerConfirm}
        onCancel={() => setDangerAction(null)}
        isLoading={isDangerLoading}
      />
    </div>
  );
}
