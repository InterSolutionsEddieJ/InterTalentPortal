/**
 * API Route: Get office email by location
 * Looks up email address from location_emails table (or Office column)
 * GET /api/location-email?location=Baltimore
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');

    if (!location) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    // Use database abstraction layer
    const result = await db.getLocationEmail(location);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching office email:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch office email',
        email: 'info@intersolutions.com',
        isDefault: true,
      },
      { status: 500 }
    );
  }
}
