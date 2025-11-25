'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearchStore } from '@/store/searchStore';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function LoadingManager() {
  const isLoading = useSearchStore((state) => state.isLoading);
  const setIsLoading = useSearchStore((state) => state.setIsLoading);
  const searchParams = useSearchParams();

  // Hide loading overlay when search params change (page has loaded with new results)
  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [searchParams, setIsLoading]); // Re-run when search params change

  return isLoading ? <LoadingOverlay /> : null;
}
