// @ts-nocheck
import type { Load } from '@sveltejs/kit';

export const load = async ({ fetch }: Parameters<Load>[0]) => {
  // Retrieve your publishable API key from the environment variable.
  const apiKey = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY;

  // Make the request to the Medusa storefront endpoint.
  const res = await fetch('/store/products', {
    headers: {
      'x-publishable-api-key': apiKey,
      'Content-Type': 'application/json'
    }
  });

  // Check if the response is ok; otherwise, throw an error.
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  // Parse the JSON data from the response.
  const data = await res.json();

  // Return the products so that they become available to your page.
  return { products: data.products };
};
