// @ts-nocheck
import type { Load } from '@sveltejs/kit';

export const load = async ({ fetch }: Parameters<Load>[0]) => {
  console.log('🔑 Medusa key:', import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY);
  const res = await fetch('/store/products', {
    headers: {
      'x-publishable-api-key': import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY,
      'Content-Type': 'application/json'
    }
  });
  console.log('🔍 Response status:', res.status);
  if (!res.ok) {
    console.error('🔴 Error text:', await res.text());
    throw new Error('Failed to fetch products');
  }
  const data = await res.json();
  console.log('✅ Products:', data.products);
  return { products: data.products };
};
