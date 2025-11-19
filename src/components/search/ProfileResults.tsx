'use client';

import { useState } from 'react';
import ProfileCard from '@/components/profiles/ProfileCard';
import ViewToggle from './ViewToggle';
import ShowMoreButton from './ShowMoreButton';
import type { Profile } from '@/lib/db/supabase';

interface ProfileResultsProps {
  profiles: Profile[];
  initialDisplay?: number;
}

export default function ProfileResults({
  profiles,
  initialDisplay = 5,
}: ProfileResultsProps) {
  // Initialize with lazy function to read localStorage once
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('profileViewMode') as
        | 'grid'
        | 'list'
        | null;
      return savedView || 'grid';
    }
    return 'grid';
  });

  // Manage how many profiles to show (start with initialDisplay, load 5 more each time)
  const [displayCount, setDisplayCount] = useState(initialDisplay);

  const handleViewChange = (view: 'grid' | 'list') => {
    setViewMode(view);
    localStorage.setItem('profileViewMode', view);
  };

  const handleShowMore = () => {
    setDisplayCount((prev) => Math.min(prev + 5, profiles.length));
  };

  const displayedProfiles = profiles.slice(0, displayCount);

  return (
    <>
      {/* View Toggle */}
      <div className="flex justify-end mb-4">
        <ViewToggle onViewChange={handleViewChange} initialView={viewMode} />
      </div>

      {/* Profile Grid or List */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
            : 'space-y-4'
        }
      >
        {displayedProfiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} variant={viewMode} />
        ))}
      </div>

      {/* Show More Button */}
      <ShowMoreButton
        currentCount={displayCount}
        totalCount={profiles.length}
        onShowMore={handleShowMore}
      />
    </>
  );
}
