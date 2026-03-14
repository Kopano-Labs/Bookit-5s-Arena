import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        insight: `**AI Insights not configured**\n\nAdd your \`ANTHROPIC_API_KEY\` to \`.env.local\` to enable AI-powered analytics insights.\n\nOnce configured, Claude will analyse your traffic patterns, identify growth opportunities, and suggest improvements to increase court bookings.`,
        mock: true,
      });
    }

    const analyticsData = await request.json();

    const prompt = `You are a sports facility analytics expert for 5S Arena, a 5-a-side football venue in Milnerton, Cape Town, South Africa.

Analyse the following website analytics data and provide 3-5 actionable insights to help increase court bookings and improve the website:

Analytics Data (last ${analyticsData.days || 30} days):
- Total Page Views: ${analyticsData.totalPageViews}
- Unique Visitors: ${analyticsData.totalVisitors}
- Top Pages: ${JSON.stringify(analyticsData.topPages?.slice(0, 5))}
- Top Referrers: ${JSON.stringify(analyticsData.topReferrers?.slice(0, 5))}
- Device Breakdown: ${JSON.stringify(analyticsData.deviceBreakdown)}
- Top Events: ${JSON.stringify(analyticsData.topEvents?.slice(0, 5))}
- Daily Views (last 7 days): ${JSON.stringify(analyticsData.pageViewsByDay?.slice(-7))}

Provide concise, practical insights in plain text. Focus on what the data reveals about user behaviour and specific actions the arena owner can take to grow bookings. Keep it under 300 words.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return NextResponse.json({ error: 'AI service error' }, { status: 500 });
    }

    const data = await response.json();
    const insight = data.content?.[0]?.text || 'No insights generated.';

    return NextResponse.json({ insight });
  } catch (err) {
    console.error('POST /api/admin/analytics/insights error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
