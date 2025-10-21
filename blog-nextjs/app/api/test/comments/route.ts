// ============================================================================
// Test Comments API Route
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockApi } from '@/lib/api/mock/index';

// Mock comment data
const mockComments = [
  {
    id: 1,
    article_id: 1,
    article_title: "Getting Started with Next.js",
    user_id: 2,
    user: {
      id: 2,
      username: "Jane Smith",
      avatar: "https://picsum.photos/seed/user2/100/100.jpg",
    },
    p_id: null,
    content: "Great article! Very helpful information about Next.js fundamentals. I especially liked the explanation of server-side rendering.",
    like_count: 12,
    reply_count: 2,
    status: "approved",
    created_at: "2024-03-15T10:30:00Z",
    updated_at: "2024-03-15T10:30:00Z",
  },
  {
    id: 2,
    article_id: 1,
    article_title: "Getting Started with Next.js",
    user_id: 3,
    user: {
      id: 3,
      username: "Bob Wilson",
      avatar: "https://picsum.photos/seed/user3/100/100.jpg",
    },
    p_id: null,
    content: "This is spam content that should be moderated. Check out my website for cheap products!",
    like_count: 0,
    reply_count: 0,
    status: "spam",
    created_at: "2024-03-14T15:45:00Z",
    updated_at: "2024-03-14T15:45:00Z",
  },
  {
    id: 3,
    article_id: 2,
    article_title: "React Best Practices",
    user_id: 4,
    user: {
      id: 4,
      username: "Alice Johnson",
      avatar: "https://picsum.photos/seed/user4/100/100.jpg",
    },
    p_id: null,
    content: "Can you write more about advanced TypeScript patterns? I'd love to see more content on conditional types.",
    like_count: 8,
    reply_count: 1,
    status: "pending",
    created_at: "2024-03-13T09:20:00Z",
    updated_at: "2024-03-13T09:20:00Z",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const article_id = searchParams.get('article_id');

    let filteredComments = mockComments;

    if (status && status !== 'all') {
      filteredComments = filteredComments.filter(comment => comment.status === status);
    }

    if (article_id) {
      filteredComments = filteredComments.filter(comment => comment.article_id === parseInt(article_id));
    }

    return NextResponse.json({
      code: 0,
      msg: 'Success',
      data: {
        list: filteredComments,
        total: filteredComments.length,
        page: 1,
        page_size: 10
      }
    });
  } catch (error: any) {
    console.error('Comments list error:', error);

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

    if (!body.content || !body.article_id) {
      return NextResponse.json({
        code: 400,
        msg: 'Content and article_id are required',
        data: null
      }, { status: 400 });
    }

    const result = await mockApi.createComment(body);

    return NextResponse.json({
      code: 0,
      msg: 'Comment created successfully',
      data: result
    });
  } catch (error: any) {
    console.error('Create comment error:', error);

    return NextResponse.json({
      code: 500,
      msg: error.message || 'Internal server error',
      data: null
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({
        code: 400,
        msg: 'Comment ID and status are required',
        data: null
      }, { status: 400 });
    }

    // Find and update comment
    const commentIndex = mockComments.findIndex(comment => comment.id === id);
    if (commentIndex === -1) {
      return NextResponse.json({
        code: 404,
        msg: 'Comment not found',
        data: null
      }, { status: 404 });
    }

    mockComments[commentIndex].status = status;
    mockComments[commentIndex].updated_at = new Date().toISOString();

    return NextResponse.json({
      code: 0,
      msg: 'Comment updated successfully',
      data: mockComments[commentIndex]
    });
  } catch (error: any) {
    console.error('Update comment error:', error);

    return NextResponse.json({
      code: 500,
      msg: error.message || 'Internal server error',
      data: null
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        code: 400,
        msg: 'Comment ID is required',
        data: null
      }, { status: 400 });
    }

    const commentIndex = mockComments.findIndex(comment => comment.id === parseInt(id));
    if (commentIndex === -1) {
      return NextResponse.json({
        code: 404,
        msg: 'Comment not found',
        data: null
      }, { status: 404 });
    }

    mockComments.splice(commentIndex, 1);

    return NextResponse.json({
      code: 0,
      msg: 'Comment deleted successfully',
      data: null
    });
  } catch (error: any) {
    console.error('Delete comment error:', error);

    return NextResponse.json({
      code: 500,
      msg: error.message || 'Internal server error',
      data: null
    }, { status: 500 });
  }
}
