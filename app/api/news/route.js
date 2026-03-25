import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch specifically 'sent' newsletters or all recent ones depends on privacy
    // Usually only 'sent' newsletters should be public news
    const news = await Newsletter.find({ status: 'sent' })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const formattedNews = news.map(item => ({
      _id: item._id.toString(),
      title: item.title,
      subject: item.subject,
      content: item.body, // The HTML body
      date: item.createdAt,
      type: 'Official Update'
    }));

    return NextResponse.json({ news: formattedNews });
  } catch (err) {
    console.error('API_NEWS_ERROR:', err);
    return NextResponse.json({ news: [] });
  }
}
