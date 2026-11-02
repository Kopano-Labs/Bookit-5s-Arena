export const dynamic = 'force-dynamic';
        import { NextResponse } from 'next/server';
        import { getAuthSession } from '@/lib/getSession';
        import { requireRole } from '@/lib/roles';
        import dbConnect from '@/lib/mongodb';
        import Booking from '@/models/Booking';
        import '@/models/Court';
        import { bookingScopeForAdmin } from '@/lib/bookings/arenaAccess';
        import { dispatchBookingCommunications } from '@/lib/bookings/dispatchBookingCommunications';
        import { updateReservation, reservationError } from '@/lib/bookings/reservationOwnership';
        import { bookingResponse } from '@/lib/bookings/bookingResponse';

            export async function PATCH(request, { params }) {
                    try {
                        const session = await getAuthSession();
                        if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
                        if (!requireRole(session, 'admin')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

                        await dbConnect();

                        const { id } = await params;

                        // Validate ObjectId format
                        if (!/^[a-fA-F0-9]{24}$/.test(id)) {
                        return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
                        }

                        const { status } = await request.json();

                        const allowed = ['pending', 'confirmed', 'cancelled'];
                        if (!allowed.includes(status)) {
                        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
                        }

                        const scope = await bookingScopeForAdmin(session);
                        let booking = await Booking.findOne({ _id: id, ...scope }).populate('court');

                        if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
                        const result = await updateReservation({ booking, changes: { status }, revokeGuestToken: status === 'cancelled' });
                        booking = result.booking;
                        const changed = result.changed;
                        const communicationReceipts = changed ? await dispatchBookingCommunications({
                          booking, court: booking.court,
                          customerName: booking.guestName || 'Bookit player',
                          customerEmail: booking.guestEmail,
                          customerPhone: booking.guestPhone,
                          purpose: 'reservation_notice',
                        }) : [];
                        return NextResponse.json({ ...bookingResponse(booking), communicationReceipts });
                    } catch (error) {
                const handled = reservationError(error);
                if (handled) return NextResponse.json({ error: handled.error }, { status: handled.status });
                console.error('Update booking error:', error);
                return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
            }
            }
