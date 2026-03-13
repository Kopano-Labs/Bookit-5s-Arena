        import { NextResponse } from 'next/server';
        import { getServerSession } from 'next-auth';
        import { authOptions } from '@/lib/authOptions';
        import dbConnect from '@/lib/dbConnect';
        import Booking from '@/models/Booking';

        export async function GET(request) {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
        if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        const status = searchParams.get('status');
        const court = searchParams.get('court');

        const match = {};
        if (from || to) {
            match.date = {};
            if (from) match.date.$gte = from;
            if (to) match.date.$lte = to;
        }
        if (status) match.status = status;
        if (court) match.court = court;

        const bookings = await Booking.find(match)
            .populate('court', 'name price_per_hour')
            .populate('user', 'name email')
            .sort({ date: -1, start_time: -1 })
            .lean();

        return NextResponse.json(bookings);
        }
