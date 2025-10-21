// ============================================================================
// Test Tags API Route
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockApi } from '@/lib/api/mock/index';

export async function GET(request: NextRequest) {
  try {
    const result = await mockApi.getArticleTags();

    return NextResponse.json({
      code: 0,
      msg: 'Success',
      data: result
    });
  } catch (error: any) {
    console.error('Tags list error:', error);

    return NextResponse.json({
      code: 500,
      msg: error.message || 'Internal server error',
      data: null
    }, { status: 500 });
  }
}
