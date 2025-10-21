// ============================================================================
// Test Articles API Route
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockApi } from '@/lib/api/mock/index';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const page_size = parseInt(searchParams.get('page_size') || '10');

    const result = await mockApi.getArticleList({ page, page_size });

    return NextResponse.json({
      code: 0,
      msg: 'Success',
      data: result
    });
  } catch (error: any) {
    console.error('Articles list error:', error);

    return NextResponse.json({
      code: 500,
      msg: error.message || 'Internal server error',
      data: null
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json({
        code: 400,
        msg: 'Title and content are required',
        data: null
      }, { status: 400 });
    }

    const result = await mockApi.createArticle(body);

    return NextResponse.json({
      code: 0,
      msg: 'Success',
      data: result
    });
  } catch (error: any) {
    console.error('Create article error:', error);

    return NextResponse.json({
      code: 500,
      msg: error.message || 'Internal server error',
      data: null
    }, { status: 500 });
  }
}
