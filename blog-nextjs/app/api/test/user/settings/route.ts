// ============================================================================
// Test User Settings API Route
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Mock update user settings
    const updatedUser = {
      id: 1,
      uuid: "user-uuid-1",
      username: body.username || "John Doe",
      email: "john@example.com",
      avatar: body.avatar || "https://picsum.photos/seed/user1/100/100.jpg",
      role: "admin",
      status: 1,
      signature: body.signature || "Web developer and tech enthusiast",
      address: body.address || "San Francisco, CA",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      code: 0,
      msg: 'Settings updated successfully',
      data: updatedUser
    });
  } catch (error: any) {
    console.error('Update settings error:', error);

    return NextResponse.json({
      code: 500,
      msg: error.message || 'Internal server error',
      data: null
    }, { status: 500 });
  }
}
