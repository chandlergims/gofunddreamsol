import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Dream from '@/models/Dream';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters
    const url = new URL(req.url);
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const order = url.searchParams.get('order') || 'desc';
    const limit = parseInt(url.searchParams.get('limit') || '9', 10);
    
    // Determine sort direction
    const sortDirection = order === 'asc' ? 1 : -1;
    
    // Create sort object
    const sortOptions: any = {};
    sortOptions[sortBy] = sortDirection;
    
    // Get total counts for stats
    const totalCount = await Dream.countDocuments({});
    const completedCount = await Dream.countDocuments({ status: 'completed' });
    const totalFunding = await Dream.aggregate([
      { $group: { _id: null, total: { $sum: "$currentFunding" } } }
    ]);
    const uniqueCreators = await Dream.distinct('creator');
    
    // Get dreams with sorting and limit for display
    const dreams = await Dream.find({})
      .sort(sortOptions)
      .limit(limit);
    
    return NextResponse.json({ 
      dreams,
      stats: {
        totalCount,
        completedCount,
        totalFunding: totalFunding.length > 0 ? totalFunding[0].total : 0,
        uniqueCreatorsCount: uniqueCreators.length
      }
    });
  } catch (error) {
    console.error('Error fetching dreams:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const data = await req.json();
    console.log('Received data in API:', data);
    const { title, description, fundingGoal, creator, imageUrl, telegram } = data;
    console.log('Extracted telegram field:', telegram);
    
    // Validate required fields
    if (!title || !description || !fundingGoal || !creator || !imageUrl || !telegram) {
      return NextResponse.json(
        { error: 'Missing required fields. Title, description, funding goal, creator, image, and telegram username are all required.' },
        { status: 400 }
      );
    }
    
    // Create a new dream
    const dreamData = {
      title,
      description,
      fundingGoal,
      creator: creator.toLowerCase(),
      imageUrl,
      telegram, // Telegram is now required
    };
    console.log('Creating dream with data:', dreamData);
    
    const dream = await Dream.create(dreamData);
    console.log('Created dream:', dream);
    
    return NextResponse.json({ dream }, { status: 201 });
  } catch (error) {
    console.error('Error creating dream:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
