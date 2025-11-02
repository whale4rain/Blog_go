// ============================================================================
// Uploads Image Fallback API Route
// ============================================================================

import { NextRequest, NextResponse } from "next/server";

/**
 * Handle dynamic image requests for uploads
 * Falls back to a default image when file doesn't exist
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const slug = params.slug.join("/");
    const filename = slug.split("/").pop() || "";

    // Extract name from filename (without extension) for avatar generation
    const baseName = filename.split(".")[0] || "User";

    // Generate a consistent avatar based on the filename
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      baseName
    )}&background=6366f1&color=fff&size=200&bold=true`;

    // Redirect to the generated avatar
    return NextResponse.redirect(avatarUrl, 302);
  } catch (error) {
    console.error("Upload image fallback error:", error);

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
