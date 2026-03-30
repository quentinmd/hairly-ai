import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-03-25.dahlia',
    });
  }
  return _stripe;
}

// Alias for backward compat
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const PLANS = {
  weekly: {
    name: 'Weekly',
    price: '$9.99',
    priceId: process.env.STRIPE_PRICE_WEEKLY!,
    interval: 'week' as const,
    description: 'Perfect to try it out',
    features: [
      'Unlimited generations',
      'HD quality results',
      'All 5+ hairstyles',
      'Download results',
    ],
  },
  monthly: {
    name: 'Monthly',
    price: '$29.99',
    priceId: process.env.STRIPE_PRICE_MONTHLY!,
    interval: 'month' as const,
    description: 'Best value for regulars',
    popular: true,
    features: [
      'Unlimited generations',
      'HD quality results',
      'All 5+ hairstyles',
      'Download results',
      'Priority generation',
    ],
  },
  yearly: {
    name: 'Yearly',
    price: '$149.99',
    priceId: process.env.STRIPE_PRICE_YEARLY!,
    interval: 'year' as const,
    description: 'Save 58% vs monthly',
    features: [
      'Unlimited generations',
      'HD quality results',
      'All 5+ hairstyles',
      'Download results',
      'Priority generation',
      'Early access to new styles',
    ],
  },
};
