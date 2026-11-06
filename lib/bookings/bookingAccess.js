import crypto from 'node:crypto';
import { isSuperAdmin, requireRole } from '@/lib/roles';
import { hashGuestManagementToken } from '@/lib/bookings/reservationOwnership';

function fixedEqual(left, right) {
  const a = Buffer.from(String(left || ''), 'hex');
  const b = Buffer.from(String(right || ''), 'hex');
  return a.length === b.length && a.length > 0 && crypto.timingSafeEqual(a, b);
}

export async function canManageBooking({ request, session, booking, action = 'read' }) {
  if (session?.user && isSuperAdmin(session.user.email)) return true;
  if (session?.user && requireRole(session, 'admin')) {
    const court = booking.court?.owner ? booking.court : await booking.populate('court', 'owner');
    return String(court.court?.owner || court.owner) === String(session.user.id);
  }
  if (session?.user && booking.user && String(booking.user) === String(session.user.id)) return true;
  if (booking.user) return false;
  const token = request.headers.get('x-booking-management-token');
  if (!token || !booking.guestManagementTokenHash || booking.guestManagementTokenRevokedAt) return false;
  if (!booking.guestManagementTokenExpiresAt || booking.guestManagementTokenExpiresAt <= new Date()) return false;
  return (booking.guestManagementPermissions || ['read']).includes(action)
    && fixedEqual(hashGuestManagementToken(token), booking.guestManagementTokenHash);
}
