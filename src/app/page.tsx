'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

/* ===================================================================
   HAIRLY AI — LANDING PAGE
   Premium dark SaaS landing with glassmorphism, gradients, animations
   =================================================================== */

// ─── NAVBAR ────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong py-3' : 'py-5'
      }`}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" className="flex items-center gap-2 text-xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>
          <span className="text-2xl">✂️</span>
          <span className="text-gradient">Hairly</span>
          <span style={{ color: 'var(--text-primary)' }}>AI</span>
        </Link>

        {/* Desktop nav */}
        <div className="nav-desktop" style={{ alignItems: 'center', gap: '32px' }}>
          <a href="#how-it-works" className="text-sm" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            How it Works
          </a>
          <a href="#styles" className="text-sm" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            Styles
          </a>
          <a href="#pricing" className="text-sm" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            Pricing
          </a>
          <Link href="/login" className="btn-secondary" style={{ padding: '10px 24px', fontSize: '14px' }}>
            Log in
          </Link>
          <Link href="/signup" className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>
            Try Free →
          </Link>
        </div>

        {/* Mobile CTA */}
        <Link href="/signup" className="nav-mobile-cta btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }}>
          Try Free
        </Link>
      </div>
    </nav>
  );
}

// ─── HERO SECTION ──────────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        paddingTop: '100px',
        paddingBottom: '60px',
      }}
    >
      {/* Background effects */}
      <div
        className="absolute inset-0"
        style={{ background: 'var(--gradient-radial-hero)' }}
      />
      <div
        className="absolute animate-float"
        style={{
          top: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          opacity: 0.2,
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        {/* Badge */}
        <div className="animate-fade-in-up" style={{ marginBottom: '32px', animationFillMode: 'forwards' }}>
          <span className="badge">
            ⚡ AI-Powered Haircut Simulator
          </span>
        </div>

        {/* Main heading */}
        <h1
          className="section-heading animate-fade-in-up"
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 5rem)',
            animationDelay: '0.1s',
            animationFillMode: 'forwards',
            fontFamily: 'Space Grotesk',
            marginBottom: '24px',
          }}
        >
          See Your New Cut
          <br />
          <span className="text-gradient">Before the Barber</span>
        </h1>

        {/* Subtext */}
        <p
          className="animate-fade-in-up"
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.2rem',
            maxWidth: '560px',
            lineHeight: 1.7,
            margin: '0 auto 40px',
            animationDelay: '0.2s',
            animationFillMode: 'forwards',
          }}
        >
          Upload a selfie, pick a hairstyle, and get an ultra-realistic preview
          in seconds. No more haircut regrets.
        </p>

        {/* CTA Buttons */}
        <div
          className="animate-fade-in-up"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '64px',
            animationDelay: '0.3s',
            animationFillMode: 'forwards',
          }}
        >
          <Link href="/signup" className="btn-primary" style={{ padding: '16px 40px', fontSize: '16px' }}>
            Try Your New Look →
          </Link>
          <a href="#how-it-works" className="btn-secondary" style={{ padding: '16px 40px', fontSize: '16px' }}>
            See How It Works
          </a>
        </div>

        {/* Before / After Preview */}
        <div
          className="animate-fade-in-up"
          style={{
            position: 'relative',
            maxWidth: '900px',
            margin: '0 auto',
            animationDelay: '0.4s',
            animationFillMode: 'forwards',
          }}
        >
          <div className="gradient-border glow-purple" style={{ borderRadius: '20px' }}>
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: '20px',
                background: 'var(--bg-card)',
                padding: '2px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                }}
              >
                {/* Before */}
                <div style={{ position: 'relative', aspectRatio: '4/3', background: 'linear-gradient(135deg, #1a1a2e 0%, #16162a 100%)' }}>
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'
                  }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                    </svg>
                    <span style={{ marginTop: '12px', fontSize: '14px', fontWeight: 500 }}>Your Selfie</span>
                  </div>
                  <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-secondary)' }}>
                      BEFORE
                    </span>
                  </div>
                </div>

                {/* After */}
                <div style={{ position: 'relative', aspectRatio: '4/3', background: 'linear-gradient(135deg, #1e1045 0%, #150d30 100%)' }}>
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✨</div>
                    <span className="text-gradient" style={{ fontSize: '14px', fontWeight: 500 }}>AI Generated Result</span>
                  </div>
                  <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                    <span className="badge">
                      ✨ AFTER
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating style pills */}
          <div className="animate-float" style={{ position: 'absolute', right: '-16px', top: '25%', animationDelay: '1s' }}>
            <div className="glass" style={{ padding: '10px 16px', borderRadius: 'var(--radius-full)', fontSize: '14px' }}>
              💈 Taper Fade
            </div>
          </div>
          <div className="animate-float" style={{ position: 'absolute', left: '-16px', top: '66%', animationDelay: '2s' }}>
            <div className="glass" style={{ padding: '10px 16px', borderRadius: 'var(--radius-full)', fontSize: '14px' }}>
              🐺 Wolf Cut
            </div>
          </div>
        </div>

        {/* Trust line */}
        <p
          className="animate-fade-in"
          style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '32px', animationDelay: '0.5s', animationFillMode: 'forwards' }}
        >
          🔒 No signup required for first preview · Ultra-realistic AI · Results in seconds
        </p>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ──────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: '📸',
      title: 'Upload Your Selfie',
      description: 'Take a clear front-facing photo or upload one from your gallery.',
    },
    {
      number: '02',
      icon: '✂️',
      title: 'Choose a Hairstyle',
      description: 'Pick from trending styles — taper fade, curly, buzzcut, mullet, wolf cut.',
    },
    {
      number: '03',
      icon: '✨',
      title: 'See Your New Look',
      description: 'Get an ultra-realistic AI preview in seconds. Download and share it.',
    },
  ];

  return (
    <section id="how-it-works" style={{ padding: '100px 0', position: 'relative' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="badge" style={{ display: 'inline-flex', marginBottom: '16px' }}>How It Works</span>
          <h2 className="section-heading">
            Three Steps to Your
            <br />
            <span className="text-gradient">Perfect Haircut</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {steps.map((step, i) => (
            <div key={step.number} className="card" style={{ padding: '40px 32px', textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-xl)',
                  background: `rgba(139, 92, 246, ${0.08 + i * 0.04})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  margin: '0 auto 24px',
                }}
              >
                {step.icon}
              </div>
              <div
                style={{ color: 'var(--accent-purple-light)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '12px' }}
              >
                STEP {step.number}
              </div>
              <h3
                style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1.25rem', marginBottom: '12px' }}
              >
                {step.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '15px' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── STYLES GALLERY ────────────────────────────────────────────────
function StylesGallery() {
  const styles = [
    { key: 'taper_fade', name: 'Taper Fade', emoji: '💈', desc: 'Clean, sharp, professional', gradient: 'linear-gradient(135deg, #1a1035, #0d1b2a)' },
    { key: 'curly', name: 'Curly', emoji: '🌀', desc: 'Defined curls, full volume', gradient: 'linear-gradient(135deg, #1a0d2e, #2d1045)' },
    { key: 'buzzcut', name: 'Buzz Cut', emoji: '✂️', desc: 'Minimal, bold, fresh', gradient: 'linear-gradient(135deg, #0d1b2a, #1a2535)' },
    { key: 'mullet', name: 'Mullet', emoji: '🎸', desc: 'Modern, edgy, trendy', gradient: 'linear-gradient(135deg, #2d1045, #1a0d2e)' },
    { key: 'wolf_cut', name: 'Wolf Cut', emoji: '🐺', desc: 'Shaggy layers, textured', gradient: 'linear-gradient(135deg, #1a2535, #0f1a28)' },
  ];

  return (
    <section id="styles" style={{ padding: '100px 0', position: 'relative' }}>
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(139,92,246,0.06), transparent 70%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="badge" style={{ display: 'inline-flex', marginBottom: '16px' }}>Hairstyles</span>
          <h2 className="section-heading">
            Pick Your
            <span className="text-gradient"> Style</span>
          </h2>
          <p className="section-subtext" style={{ margin: '16px auto 0' }}>
            5 trending hairstyles powered by cutting-edge AI. More styles coming soon.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
          {styles.map((style) => (
            <div
              key={style.key}
              className="card glow-purple-hover"
              style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
            >
              <div
                style={{
                  aspectRatio: '3/4',
                  background: style.gradient,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.4s',
                }}
              >
                <span style={{ fontSize: '3rem', marginBottom: '16px' }}>{style.emoji}</span>
              </div>
              <div style={{ padding: '16px 16px 20px' }}>
                <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                  {style.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{style.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ──────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      name: 'Alex M.',
      text: 'Saved me from a terrible haircut decision. The AI preview looked exactly like the real thing!',
      stars: 5,
      avatar: '👨',
    },
    {
      name: 'Jordan K.',
      text: 'I was scared to try a buzz cut. Hairly AI showed me how it would look — turned out amazing.',
      stars: 5,
      avatar: '🧑',
    },
    {
      name: 'Marcus T.',
      text: 'The taper fade preview was so realistic. My barber was impressed when I showed him the AI result.',
      stars: 5,
      avatar: '👨‍🦱',
    },
  ];

  return (
    <section style={{ padding: '100px 0' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="badge" style={{ display: 'inline-flex', marginBottom: '16px' }}>Testimonials</span>
          <h2 className="section-heading">
            Loved by
            <span className="text-gradient"> Thousands</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {testimonials.map((t, i) => (
            <div key={i} className="card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {Array.from({ length: t.stars }, (_, j) => (
                  <span key={j} style={{ fontSize: '14px', color: '#fbbf24' }}>★</span>
                ))}
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '15px', marginBottom: '24px' }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>{t.avatar}</span>
                <span style={{ fontWeight: 500, fontSize: '14px' }}>{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PRICING PREVIEW ───────────────────────────────────────────────
function PricingPreview() {
  const plans = [
    { name: 'Weekly', price: '$9.99', period: '/week', desc: 'Try it out', features: ['Unlimited generations', 'HD quality', 'All 5+ styles'] },
    { name: 'Monthly', price: '$29.99', period: '/month', desc: 'Best value', popular: true, features: ['Unlimited generations', 'HD quality', 'All 5+ styles', 'Priority generation'] },
    { name: 'Yearly', price: '$149.99', period: '/year', desc: 'Save 58%', features: ['Unlimited generations', 'HD quality', 'All 5+ styles', 'Priority generation', 'Early access'] },
  ];

  return (
    <section id="pricing" style={{ padding: '100px 0', position: 'relative' }}>
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(59,130,246,0.06), transparent 70%)' }}
      />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="badge" style={{ display: 'inline-flex', marginBottom: '16px' }}>Pricing</span>
          <h2 className="section-heading">
            Simple
            <span className="text-gradient"> Pricing</span>
          </h2>
          <p className="section-subtext" style={{ margin: '16px auto 0' }}>
            Start with a free preview. Upgrade for unlimited AI generations.
          </p>
        </div>

        {/* Free with API key banner */}
        <div
          className="glass"
          style={{
            padding: '16px 24px',
            borderRadius: 'var(--radius-lg)',
            borderColor: 'rgba(16, 185, 129, 0.2)',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          <span className="badge-green" style={{ marginRight: '8px' }}>FREE</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Use your own Gemini API key for unlimited free generations ⚡
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card ${plan.popular ? 'pricing-card-popular' : ''}`}
              style={{ padding: '36px 28px', position: 'relative' }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--gradient-main)',
                    padding: '4px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'white',
                  }}
                >
                  POPULAR
                </div>
              )}

              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1.125rem', marginBottom: '4px' }}>
                {plan.name}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>{plan.desc}</p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '2rem' }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{plan.period}</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent-green)' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={plan.popular ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '12px', fontSize: '14px', width: '100%', textAlign: 'center' }}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA SECTION ───────────────────────────────────────────────────
function CTASection() {
  return (
    <section style={{ padding: '100px 0' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <div
          className="gradient-border glow-purple"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: '80px 40px',
            background: 'var(--bg-card)',
          }}
        >
          <h2
            className="section-heading"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '24px' }}
          >
            Ready for Your
            <br />
            <span className="text-gradient">New Look?</span>
          </h2>
          <p className="section-subtext" style={{ margin: '0 auto 32px' }}>
            Join thousands who preview their haircut before the barber.
            Your first preview is free.
          </p>
          <Link href="/signup" className="btn-primary" style={{ padding: '18px 48px', fontSize: '16px' }}>
            ✂️ Try Hairly AI Free
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '48px 0' }}>
      <div style={{
        maxWidth: '1100px', margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Space Grotesk', fontWeight: 700 }}>
          <span>✂️</span>
          <span className="text-gradient">Hairly</span>
          <span>AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          <Link href="/pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Pricing</Link>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms</a>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Hairly AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <StylesGallery />
      <Testimonials />
      <PricingPreview />
      <CTASection />
      <Footer />
    </main>
  );
}
