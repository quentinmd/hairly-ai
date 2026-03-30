'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profile, setProfile] = useState<{
    email: string;
    full_name: string;
    subscription_status: string;
    credits: number;
  } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('email, full_name, subscription_status, credits, encrypted_api_key')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          email: data.email,
          full_name: data.full_name || '',
          subscription_status: data.subscription_status || 'free',
          credits: data.credits ?? 0,
        });
        setHasStoredKey(!!data.encrypted_api_key);
      }
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/settings/apikey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save API key');
      }

      setMessage({ type: 'success', text: 'API key saved and validated! You can now generate for free.' });
      setHasStoredKey(true);
      setApiKey('');
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveApiKey = async () => {
    setTesting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/settings/apikey', {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove');

      setHasStoredKey(false);
      setMessage({ type: 'success', text: 'API key removed.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to remove' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
        ⚙️ Settings
      </h1>
      <p className="mb-8" style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
        Manage your account, API key, and subscription.
      </p>

      {/* Account Section */}
      <div className="card mb-6" style={{ padding: '28px' }}>
        <h2 className="font-semibold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
          👤 Account
        </h2>
        {profile && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>NAME</label>
              <p className="text-sm">{profile.full_name || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>EMAIL</label>
              <p className="text-sm">{profile.email}</p>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>PLAN</label>
              <div className="flex items-center gap-2">
                <span className={profile.subscription_status === 'active' ? 'badge-green' : 'badge'}>
                  {profile.subscription_status === 'active' ? '✨ Premium' : 'Free'}
                </span>
                {profile.subscription_status !== 'active' && (
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    ({profile.credits} free preview{profile.credits !== 1 ? 's' : ''} remaining)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* API Key Section */}
      <div className="card mb-6" style={{ padding: '28px' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk' }}>
              🔑 API Key
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Add your Gemini API key to generate for free
            </p>
          </div>
          {hasStoredKey && (
            <span className="badge-green">Connected</span>
          )}
        </div>

        {/* Info banner */}
        <div
          className="mb-5 p-4 rounded-xl text-sm"
          style={{
            background: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.15)',
          }}
        >
          <p className="font-medium mb-1" style={{ color: 'var(--accent-purple-light)' }}>
            ⚡ Free generations with your own key
          </p>
          <p style={{ color: 'var(--text-secondary)' }}>
            Get a free API key from{' '}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: 'var(--accent-purple-light)' }}
            >
              Google AI Studio
            </a>
            . Your key is encrypted and never exposed on the client.
          </p>
        </div>

        {hasStoredKey ? (
          <div className="flex items-center gap-3">
            <div className="flex-1 input-field" style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>••••••••••••••••••••</span>
            </div>
            <button
              onClick={handleRemoveApiKey}
              className="btn-secondary"
              style={{ padding: '10px 16px', fontSize: '13px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
              disabled={testing}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type={showKey ? 'text' : 'password'}
                className="input-field pr-12"
                placeholder="Paste your Gemini API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
            <button
              onClick={handleSaveApiKey}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '13px', whiteSpace: 'nowrap' }}
              disabled={!apiKey.trim() || saving}
            >
              {saving ? 'Saving...' : 'Save Key'}
            </button>
          </div>
        )}

        {message && (
          <div
            className="mt-4 p-3 rounded-lg text-sm"
            style={{
              background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              color: message.type === 'success' ? 'var(--accent-green)' : '#ef4444',
            }}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* Subscription Section */}
      <div className="card" style={{ padding: '28px' }}>
        <h2 className="font-semibold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
          💳 Subscription
        </h2>

        {profile?.subscription_status === 'active' ? (
          <div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              You&apos;re on the Premium plan. Manage your subscription via Stripe.
            </p>
            <a
              href="/api/stripe/portal"
              className="btn-secondary"
              style={{ padding: '10px 20px', fontSize: '13px' }}
            >
              Manage Subscription →
            </a>
          </div>
        ) : (
          <div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Upgrade to Premium for unlimited HD generations, all styles, and priority processing.
            </p>
            <a
              href="/pricing"
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              Upgrade to Premium →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
