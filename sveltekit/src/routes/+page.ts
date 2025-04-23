import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ fetch }) => {
  console.log('🔑 Medusa key:', import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY);
  console.log('🔍 Fetching products…');
  const res = await fetch('/store/products', {
    headers: {
      'x-publishable-api-key': import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY,
      'Content-Type': 'application/json'
    }
  });

  console.log('🔍 Response status:', res.status);
  if (!res.ok) {
    const text = await res.text();
    console.error('🔴 Fetch error text:', text);
    throw new Error('Failed to fetch products');
  }
  const data = await res.json();
  console.log('✅ Products data:', data);
  return { products: data.products };
};