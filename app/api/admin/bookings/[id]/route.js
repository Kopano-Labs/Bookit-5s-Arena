        import { NextResponse } from 'next/server';
        import { getServerSession } from 'next-auth';
        import { authOptions } from '@/lib/authOptions';
        import dbConnect from '@/lib/dbConnect';
        import Booking from '@/models/Booking';

        export async function PATCH(request, { params }) {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
        if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await dbConnect();
        const { status } = await request.json();

        const allowed = ['pending', 'confirmed', 'cancelled'];
        if (!allowed.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const booking = await Booking.findByIdAndUpdate(
            params.id,
            { status },
            { new: true }
        );

        if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        return NextResponse.json(booking);
        }
