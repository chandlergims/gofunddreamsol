import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Dream from '@/models/Dream';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const dream = await Dream.findById(params.id);
    
    if (!dream) {
      return NextResponse.json(
        { error: 'Dream not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ dream });
  } catch (error) {
    console.error('Error fetching dream:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
  const data = await req.json();
  const { title, description, fundingGoal, status, imageUrl, telegram } = data;
    
    const dream = await Dream.findById(params.id);
    
    if (!dream) {
      return NextResponse.json(
        { error: 'Dream not found' },
        { status: 404 }
      );
    }
    
    // Update the dream
    if (title) dream.title = title;
    if (description) dream.description = description;
    if (fundingGoal) dream.fundingGoal = fundingGoal;
    if (status) dream.status = status;
    if (imageUrl) dream.imageUrl = imageUrl;
    if (telegram !== undefined) dream.telegram = telegram;
    
    await dream.save();
    
    return NextResponse.json({ dream });
  } catch (error) {
    console.error('Error updating dream:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const dream = await Dream.findByIdAndDelete(params.id);
    
    if (!dream) {
      return NextResponse.json(
        { error: 'Dream not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dream:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
