// ============================================================================
// Default Avatar API Route
// ============================================================================

import { NextRequest, NextResponse } from "next/server";

/**
 * Handle avatar image requests
 * Returns a redirect to a reliable avatar service
 */
export async function GET(request: NextRequest) {
  try {
    // Redirect to a reliable avatar service
    const avatarUrl = "https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff&size=200";

    return NextResponse.redirect(avatarUrl, 302);
  } catch (error) {
    console.error("Avatar generation error:", error);

    // Fallback: return a 1x1 transparent pixel
    const transparentPixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      "base64"
    );

    return new NextResponse(transparentPixel, {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "public, max-age=86400", // Cache for 1 day
      },
    });
  }
}

/**
 * Handle other HTTP methods
 */
export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
