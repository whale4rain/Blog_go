// ============================================================================
// Test Create Article API Route
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockApi } from '@/lib/api/mock/index';
import type { CreateArticleRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateArticleRequest = await request.json();

    // Validation
    if (!body.title || !body.content) {
      return NextResponse.json({
        code: 400,
        msg: 'Title and content are required',
        data: null
      }, { status: 400 });
    }

    if (!body.category) {
      return NextResponse.json({
        code: 400,
        msg: 'Category is required',
        data: null
      }, { status: 400 });
    }

    // Set defaults
    const articleData = {
      ...body,
      abstract: body.abstract || body.content.substring(0, 200) + '...',
      status: body.status || 'draft',
      tags: body.tags || []
    };

    const result = await mockApi.createArticle(articleData);

    return NextResponse.json({
      code: 0,
      msg: 'Article created successfully',
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
