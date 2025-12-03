import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Cache duration in seconds (5 minutes)
const CACHE_DURATION = 300;

// In-memory cache for professions
let cachedProfessions: string[] | null = null;
let cacheTimestamp: number = 0;

/**
 * GET /api/professions
 * Returns list of all available profession types
 * Cached for 5 minutes to reduce database load
 */
export async function GET() {
  try {
    const now = Date.now();

    // Check if cache is valid
    if (cachedProfessions && now - cacheTimestamp < CACHE_DURATION * 1000) {
      return NextResponse.json(
        {
          success: true,
          data: cachedProfessions,
          meta: {
            count: cachedProfessions.length,
            cached: true,
          },
        },
        {
          headers: {
            'Cache-Control': `public, max-age=${CACHE_DURATION}, stale-while-revalidate=60`,
          },
        }
      );
    }

    // Fetch profession types using abstraction layer
    const professions = await db.getProfessionTypes();

    // Update cache
    cachedProfessions = professions;
    cacheTimestamp = now;

    return NextResponse.json(
      {
        success: true,
        data: professions,
        meta: {
          count: professions.length,
          cached: false,
        },
      },
      {
        headers: {
          'Cache-Control': `public, max-age=${CACHE_DURATION}, stale-while-revalidate=60`,
        },
      }
    );
  } catch (error) {
    console.error('Error fetching professions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch professions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
