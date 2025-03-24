import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Image from '@/models/Image';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    await dbConnect();
    
    const { filename } = params;
    
    // Find the image in the database
    const image = await Image.findOne({ filename });
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    // Return the image with the correct content type
    return new NextResponse(image.data, {
      headers: {
        'Content-Type': image.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error retrieving image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
