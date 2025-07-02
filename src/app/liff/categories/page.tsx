'use client';

import { useLiff } from '@/contexts/LiffContext';

export default function CategoriesPage() {
  const { isLoggedIn, login } = useLiff();

  if (!isLoggedIn) {
    return (
      <div className="px-2 py-4">
        <h1 className="text-2xl font-bold mb-4">Categories</h1>
        <button
          onClick={login}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login with LINE to View Categories
        </button>
      </div>
    );
  }

  return (
    <div className="px-2 py-4">
      <h1 className="text-2xl font-bold mb-4">Product Categories</h1>
      <ul className="space-y-2">
        <li className="text-blue-600 hover:underline">Electronics</li>
        <li className="text-blue-600 hover:underline">Clothing</li>
        <li className="text-blue-600 hover:underline">Accessories</li>
      </ul>
    </div>
  );
}