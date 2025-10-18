// ============================================================================
// Test Login API Route
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockApi } from '@/lib/api/mock/index';
import type { LoginRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json({
        code: 400,
        msg: 'Email and password are required',
        data: null
      }, { status: 400 });
    }

    const result = await mockApi.login(body);

    return NextResponse.json({
      code: 0,
      msg: 'Success',
      data: result
    });
  } catch (error: any) {
    console.error('Login error:', error);

    return NextResponse.json({
      code: 500,
      msg: error.message || 'Internal server error',
      data: null
    }, { status: 500 });
  }
}
