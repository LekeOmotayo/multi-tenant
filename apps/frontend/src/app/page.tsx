'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      // If user is already authenticated, redirect to dashboard
      router.push('/dashboard');
    } else {
      // If user is not authenticated, redirect to signup
      router.push('/auth/signup');
    }
  }, [isAuthenticated, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-white text-lg font-semibold">Redirecting...</p>
      </div>
    </div>
  );
}
