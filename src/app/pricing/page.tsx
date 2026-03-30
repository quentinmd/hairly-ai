'use client';

import Link from 'next/link';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PLANS = [
  {
    name: 'Weekly',
    price: '$9.99',
    period: '/week',
    desc: 'Perfect to try it out',
    priceEnv: 'weekly',
    features: [
      'Unlimited generations',
      'HD quality results',
      'All 5+ hairstyles',
      'Download results',
    ],
  },
  {
    name: 'Monthly',
    price: '$29.99',
    period: '/month',
    desc: 'Best value for regulars',
    popular: true,
    priceEnv: 'monthly',
    features: [
      'Unlimited generations',
      'HD quality results',
      'All 5+ hairstyles',
      'Download results',
      'Priority generation',
    ],
  },
  {
    name: 'Yearly',
    price: '$149.99',
    period: '/year',
    desc: 'Save 58% vs monthly',
    priceEnv: 'yearly',
    features: [
      'Unlimited generations',
      'HD quality results',
      'All 5+ hairstyles',
      'Download results',
      'Priority generation',
      'Early access to new styles',
    ],
  },
];

export default function PricingPage() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (priceEnv: string) => {
    setLoadingPlan(priceEnv);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: priceEnv }),
      });

      const data = await res.json();

      if (data.error) {
        if (res.status === 401) {
          window.location.href = '/login?redirect=/pricing';
          return;
        }
        alert(data.error);
        return;
      }

      setClientSecret(data.clientSecret);
      setShowCheckout(true);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav className="py-5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>
            <span>✂️</span>
            <span className="text-gradient">Hairly</span>
            <span>AI</span>
          </Link>
          <Link href="/app" className="btn-secondary" style={{ padding: '10px 24px', fontSize: '14px' }}>
            ← Back to App
          </Link>
        </div>
      </nav>

      {/* Checkout modal */}
      {showCheckout && clientSecret && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-lg mx-4 relative"
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <button
              onClick={() => { setShowCheckout(false); setClientSecret(null); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              ✕
            </button>

            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      )}

      <div style={{ padding: '60px 0 120px' }}>
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="badge mb-6" style={{ display: 'inline-flex' }}>Pricing</span>
            <h1
              className="section-heading mb-4"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
            >
              Unlock Your
              <span className="text-gradient"> New Look</span>
            </h1>
            <p className="section-subtext mx-auto">
              Start with a free preview. Upgrade for unlimited AI-powered hairstyle generations.
            </p>
          </div>

          {/* API key banner */}
          <div
            className="glass mb-12 text-center"
            style={{
              padding: '20px 24px',
              borderRadius: 'var(--radius-lg)',
              borderColor: 'rgba(16, 185, 129, 0.2)',
            }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="badge-green">FREE OPTION</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Use your own Gemini API key for <strong style={{ color: 'var(--text-primary)' }}>unlimited free generations</strong> ⚡
              </span>
              <Link
                href="/app/settings"
                className="text-sm font-medium"
                style={{ color: 'var(--accent-purple-light)' }}
              >
                Add your key →
              </Link>
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`card ${plan.popular ? 'pricing-card-popular' : ''}`}
                style={{ padding: '40px 32px', position: 'relative' }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                    style={{
                      background: 'var(--gradient-main)',
                      padding: '5px 20px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'white',
                      letterSpacing: '0.05em',
                    }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                  {plan.name}
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{plan.desc}</p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>
                    {plan.price}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                        style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: 'var(--accent-green)',
                        }}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.priceEnv)}
                  className={plan.popular ? 'btn-primary w-full' : 'btn-secondary w-full'}
                  style={{ padding: '14px', fontSize: '14px' }}
                  disabled={loadingPlan === plan.priceEnv}
                >
                  {loadingPlan === plan.priceEnv ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="loader-ring" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                      Loading...
                    </span>
                  ) : (
                    'Get Started →'
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ fontFamily: 'Space Grotesk' }}>
              Frequently Asked Questions
            </h2>

            {[
              {
                q: 'Can I try it for free?',
                a: 'Yes! You get 1 free preview when you sign up. You can also use your own Gemini API key for unlimited free generations.',
              },
              {
                q: 'How realistic are the results?',
                a: 'We use Google\'s Nano Banana Pro (Gemini 3 Pro Image), the most advanced AI image model available. Results are ultra-realistic and maintain your facial features.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely. Cancel your subscription anytime from your settings. No questions asked.',
              },
              {
                q: 'What is the "Bring Your Own API Key" option?',
                a: 'You can get a free Gemini API key from Google AI Studio and use it in Hairly AI. This lets you generate unlimited previews at no cost.',
              },
            ].map((faq) => (
              <div key={faq.q} className="card mb-4" style={{ padding: '24px' }}>
                <h3 className="font-semibold mb-2" style={{ fontFamily: 'Space Grotesk' }}>{faq.q}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '32px 0' }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Hairly AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
