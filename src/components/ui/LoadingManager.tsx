'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearchStore } from '@/store/searchStore';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function LoadingManager() {
  const isLoading = useSearchStore((state) => state.isLoading);
  const setIsLoading = useSearchStore((state) => state.setIsLoading);
  const searchParams = useSearchParams();
  const previousSearchParams = useRef<string>('');

  // Clear loading state when the page has actually finished rendering with new results
  useEffect(() => {
    const currentParams = searchParams.toString();

    // Only clear loading if:
    // 1. We're currently in loading state
    // 2. The search params have actually changed (indicating navigation completed)
    // 3. The DOM has had time to update (using requestAnimationFrame)
    if (isLoading && currentParams !== previousSearchParams.current) {
      // Wait for browser to complete rendering
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsLoading(false);
        });
      });

      // Update the ref to track this params change
      previousSearchParams.current = currentParams;
    }
  }, [searchParams, isLoading, setIsLoading]);

  // Initialize previousSearchParams on mount
  useEffect(() => {
    previousSearchParams.current = searchParams.toString();
  }, [searchParams]);

  // Clear loading state on mount/unmount (handles refresh, back/forward navigation)
  useEffect(() => {
    // On mount: immediately clear any stale loading state
    setIsLoading(false);

    return () => {
      // On unmount: cleanup loading state
      setIsLoading(false);
    };
  }, [setIsLoading]);

  return isLoading ? <LoadingOverlay /> : null;
}
