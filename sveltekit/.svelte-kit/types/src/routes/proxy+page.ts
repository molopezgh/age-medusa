// @ts-nocheck
// File: sveltekit/src/routes/+page.ts
import type { Load } from '@sveltejs/kit';

const MEDUSA_BACKEND_URL      = import.meta.env.VITE_MEDUSA_BACKEND_URL;
const MEDUSA_PUBLISHABLE_KEY  = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY;
const STRIPE_PUBLISHABLE_KEY  = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const load = async ({ fetch }: Parameters<Load>[0]) => {
  // for debugging only—feel free to remove these after you verify
  console.log('🔑 Medusa publishable key:', MEDUSA_PUBLISHABLE_KEY);
  console.log('🔗 Backend URL:', MEDUSA_BACKEND_URL);

  // fetch the product list via the Vite proxy (/store → MEDUSA_BACKEND_URL)
  const res = await fetch('/store/products', {
    headers: {
      'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      'Content-Type': 'application/json'
    }
  });

  console.log('🔍 Response status:', res.status);
  if (!res.ok) {
    console.error('🔴 Error text:', await res.text());
    throw new Error('Failed to fetch products');
  }

  const data = await res.json();
  return { products: data.products };
};
