import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import dbConnect from '@/lib/db';
import Image from '@/models/Image';

export async function POST(req: NextRequest) {
  try {
    // Get the form data
    const formData = await req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }
    
    // Create a unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${randomUUID()}.${fileExtension}`;
    
    // Convert the file to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Connect to the database
    await dbConnect();
    
    // Save the image to MongoDB
    const newImage = new Image({
      filename: fileName,
      contentType: file.type,
      data: buffer
    });
    
    await newImage.save();
    
    // Return the URL to the image API endpoint
    const imageUrl = `/api/images/${fileName}`;
    
    return NextResponse.json({ 
      success: true,
      url: imageUrl
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
