'use client';

import { useState, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const STYLES = [
  { key: 'taper_fade', name: 'Taper Fade', emoji: '💈', gradient: 'linear-gradient(135deg, #1a1035, #0d1b2a)' },
  { key: 'curly', name: 'Curly', emoji: '🌀', gradient: 'linear-gradient(135deg, #1a0d2e, #2d1045)' },
  { key: 'buzzcut', name: 'Buzz Cut', emoji: '✂️', gradient: 'linear-gradient(135deg, #0d1b2a, #1a2535)' },
  { key: 'mullet', name: 'Mullet', emoji: '🎸', gradient: 'linear-gradient(135deg, #2d1045, #1a0d2e)' },
  { key: 'wolf_cut', name: 'Wolf Cut', emoji: '🐺', gradient: 'linear-gradient(135deg, #1a2535, #0f1a28)' },
];

type GenerationState = 'idle' | 'uploading' | 'generating' | 'done' | 'error';

export default function AppDashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isBlurred, setIsBlurred] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userStatus, setUserStatus] = useState<{ subscription: string; credits: number; hasApiKey: boolean }>({
    subscription: 'free',
    credits: 1,
    hasApiKey: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Check user status on mount
  useState(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status, credits, encrypted_api_key')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserStatus({
            subscription: profile.subscription_status || 'free',
            credits: profile.credits ?? 1,
            hasApiKey: !!profile.encrypted_api_key,
          });
        }
      }
    })();
  });

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image must be under 10MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setGenerationState('idle');
    setErrorMsg('');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
      setGenerationState('idle');
      setErrorMsg('');
    }
  }, []);

  const handleGenerate = async () => {
    if (!selectedFile || !selectedStyle) return;

    setGenerationState('generating');
    setErrorMsg('');

    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: selectedFile.type,
          style: selectedStyle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setResultUrl(data.imageUrl);
      setIsBlurred(data.blurred || false);
      setGenerationState('done');

      // Update credits
      if (data.creditsRemaining !== undefined) {
        setUserStatus((prev) => ({ ...prev, credits: data.creditsRemaining }));
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setGenerationState('error');
    }
  };

  const canGenerate = selectedFile && selectedStyle && generationState !== 'generating';

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
          ✂️ AI Haircut Generator
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Upload a selfie, pick a style, and see your new look in seconds.
        </p>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-3 mb-8">
        {userStatus.subscription === 'active' ? (
          <span className="badge-green">✨ Premium Active</span>
        ) : (
          <span className="badge">Free Plan · {userStatus.credits} preview{userStatus.credits !== 1 ? 's' : ''} left</span>
        )}
        {userStatus.hasApiKey && (
          <span className="badge-green">🔑 API Key Connected</span>
        )}
        {!userStatus.hasApiKey && userStatus.subscription !== 'active' && (
          <Link href="/app/settings" className="badge" style={{ cursor: 'pointer', textDecoration: 'none' }}>
            ⚡ Add API key for free generations
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN — Upload + Style Selection */}
        <div className="space-y-6">
          {/* Upload area */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 className="font-semibold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
              📸 Your Photo
            </h2>

            {!previewUrl ? (
              <div
                className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors"
                style={{
                  borderColor: 'var(--border-subtle)',
                  padding: '60px 20px',
                  background: 'var(--bg-secondary)',
                }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <div className="text-4xl mb-4">📷</div>
                <p className="font-medium mb-1">Drop your selfie here</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  or click to browse · JPG, PNG · Max 10MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Your selfie"
                  className="w-full rounded-xl"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
                <button
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                    setResultUrl(null);
                    setGenerationState('idle');
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Style selector */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 className="font-semibold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
              ✂️ Choose Your Style
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {STYLES.map((style) => (
                <button
                  key={style.key}
                  onClick={() => setSelectedStyle(style.key)}
                  className="rounded-xl text-left transition-all"
                  style={{
                    padding: '16px',
                    background: selectedStyle === style.key
                      ? 'rgba(139, 92, 246, 0.15)'
                      : 'var(--bg-secondary)',
                    border: selectedStyle === style.key
                      ? '2px solid var(--accent-purple)'
                      : '2px solid transparent',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <span className="text-2xl block mb-2">{style.emoji}</span>
                  <span className="text-sm font-medium">{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          {errorMsg && (
            <div
              className="p-4 rounded-xl text-sm"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
              }}
            >
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleGenerate}
            className="btn-primary w-full"
            style={{
              padding: '18px',
              fontSize: '16px',
              opacity: canGenerate ? 1 : 0.5,
              cursor: canGenerate ? 'pointer' : 'not-allowed',
            }}
            disabled={!canGenerate}
          >
            {generationState === 'generating' ? (
              <span className="flex items-center gap-3">
                <span className="loader-ring" style={{ width: '22px', height: '22px', borderWidth: '2px' }} />
                Generating your new look...
              </span>
            ) : (
              '✨ Generate My New Look'
            )}
          </button>
        </div>

        {/* RIGHT COLUMN — Result */}
        <div className="card" style={{ padding: '24px', minHeight: '500px' }}>
          <h2 className="font-semibold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
            ✨ Result
          </h2>

          {generationState === 'idle' && !resultUrl && (
            <div
              className="flex flex-col items-center justify-center h-full"
              style={{ minHeight: '400px', color: 'var(--text-muted)' }}
            >
              <div className="text-5xl mb-4">🪄</div>
              <p className="text-sm">Upload a photo and select a style to see your new look</p>
            </div>
          )}

          {generationState === 'generating' && (
            <div
              className="flex flex-col items-center justify-center"
              style={{ minHeight: '400px' }}
            >
              <div className="loader-ring mb-6" style={{ width: '56px', height: '56px', borderWidth: '3px' }} />
              <p className="font-medium mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                Creating your new look...
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                This usually takes 10-20 seconds
              </p>
            </div>
          )}

          {generationState === 'done' && resultUrl && (
            <div className="relative">
              <img
                src={resultUrl}
                alt="AI generated hairstyle"
                className={`w-full rounded-xl ${isBlurred ? 'result-blurred' : 'result-clear'}`}
                style={{ maxHeight: '500px', objectFit: 'cover' }}
              />

              {/* Paywall overlay */}
              {isBlurred && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-xl"
                  style={{
                    background: 'rgba(6, 6, 10, 0.6)',
                    backdropFilter: 'blur(2px)',
                  }}
                >
                  <div className="text-center px-6">
                    <div className="text-4xl mb-4">🔒</div>
                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      Unlock Your New Look
                    </h3>
                    <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                      Subscribe to see your full HD result, or add your own API key.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/pricing" className="btn-primary" style={{ padding: '12px 24px', fontSize: '14px' }}>
                        Unlock for $9.99/week
                      </Link>
                      <Link
                        href="/app/settings"
                        className="btn-secondary"
                        style={{ padding: '12px 24px', fontSize: '14px' }}
                      >
                        ⚡ Use API Key (Free)
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Download button */}
              {!isBlurred && (
                <div className="mt-4 flex gap-3">
                  <a
                    href={resultUrl}
                    download="hairly-ai-result.png"
                    className="btn-primary flex-1"
                    style={{ padding: '12px', fontSize: '14px' }}
                  >
                    📥 Download Result
                  </a>
                  <button
                    onClick={() => {
                      setResultUrl(null);
                      setGenerationState('idle');
                    }}
                    className="btn-secondary"
                    style={{ padding: '12px 20px', fontSize: '14px' }}
                  >
                    Try Another
                  </button>
                </div>
              )}
            </div>
          )}

          {generationState === 'error' && (
            <div
              className="flex flex-col items-center justify-center"
              style={{ minHeight: '400px' }}
            >
              <div className="text-5xl mb-4">😵</div>
              <p className="font-medium mb-2">Generation Failed</p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                {errorMsg || 'Something went wrong. Please try again.'}
              </p>
              <button
                onClick={() => setGenerationState('idle')}
                className="btn-secondary"
                style={{ padding: '10px 20px', fontSize: '14px' }}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
