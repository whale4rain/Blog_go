// ============================================================================
// Test Images API Route
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// Mock image data
const mockImages = [
  {
    id: "1",
    name: "blog-cover-1.jpg",
    url: "https://picsum.photos/seed/blog1/800/400.jpg",
    size: 245760,
    type: "image/jpeg",
    uploadedAt: "2024-03-15T10:30:00Z",
    folder: "covers",
    dimensions: { width: 800, height: 400 },
  },
  {
    id: "2",
    name: "article-image-2.png",
    url: "https://picsum.photos/seed/article2/600/400.jpg",
    size: 184320,
    type: "image/png",
    uploadedAt: "2024-03-14T15:45:00Z",
    folder: "articles",
    dimensions: { width: 600, height: 400 },
  },
  {
    id: "3",
    name: "gallery-photo-3.jpg",
    url: "https://picsum.photos/seed/gallery3/1200/800.jpg",
    size: 512000,
    type: "image/jpeg",
    uploadedAt: "2024-03-13T09:20:00Z",
    folder: "gallery",
    dimensions: { width: 1200, height: 800 },
  },
  {
    id: "4",
    name: "recent-upload-4.webp",
    url: "https://picsum.photos/seed/recent4/400/400.jpg",
    size: 98304,
    type: "image/webp",
    uploadedAt: "2024-03-16T14:10:00Z",
    folder: "uploads",
    dimensions: { width: 400, height: 400 },
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    const search = searchParams.get('search');

    let filteredImages = mockImages;

    if (folder && folder !== 'all') {
      filteredImages = filteredImages.filter(img => img.folder === folder);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredImages = filteredImages.filter(img =>
        img.name.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      code: 0,
      msg: 'Success',
      data: {
        list: filteredImages,
        total: filteredImages.length,
        page: 1,
        page_size: 10
      }
    });
  } catch (error: any) {
    console.error('Images list error:', error);

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

    // Simulate image upload
    const newImage = {
      id: Date.now().toString(),
      name: body.name || `upload-${Date.now()}.jpg`,
      url: body.url || `https://picsum.photos/seed/upload${Date.now()}/800/600.jpg`,
      size: body.size || 1024000,
      type: body.type || 'image/jpeg',
      uploadedAt: new Date().toISOString(),
      folder: body.folder || 'uploads',
      dimensions: body.dimensions || { width: 800, height: 600 },
    };

    // Add to mock images (in real scenario, would save to storage)
    mockImages.unshift(newImage);

    return NextResponse.json({
      code: 0,
      msg: 'Image uploaded successfully',
      data: newImage
    });
  } catch (error: any) {
    console.error('Image upload error:', error);

    return NextResponse.json({
      code: 500,
      msg: error.message || 'Internal server error',
      data: null
    }, { status: 500 });
  }
}
