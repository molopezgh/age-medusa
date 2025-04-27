import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ params, fetch }) => {
  console.log('▶️ Loading product details, id =', params.id);
  const res = await fetch(`/store/products/${params.id}`, {
    headers: { 
      'x-publishable-api-key': import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY,
      'Content-Type': 'application/json'
    }
  });
  console.log('🔍 fetch status:', res.status);
  if (!res.ok) {
    const text = await res.text();
    console.error('❌ fetch error text:', text);
    throw new Error(`Failed to fetch product ${params.id}`);
  }
  const data = await res.json();
  console.log('✅ fetched product:', data.product);
  return { product: data.product };
};
