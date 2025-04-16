// @ts-nocheck
import type { Load } from '@sveltejs/kit';

export const load = async ({ params, fetch }: Parameters<Load>[0]) => {
  const { id } = params;
  const apiKey = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY;

  // Fetch product details for the given id
  const res = await fetch(`/store/products/${id}`, {
    headers: {
      'x-publishable-api-key': apiKey,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }

  const data = await res.json();
  return { product: data.product };
};
