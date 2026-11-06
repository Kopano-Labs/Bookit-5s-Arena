import Court from '@/models/Court';
import { isSuperAdmin, requireRole } from '@/lib/roles';
import { isFeatureEnabled } from '@/lib/features';

export async function bookingAdminAccessError(session, action = 'view') {
  if (!session?.user?.id) return Response.json({ error: 'Authentication required' }, { status: 401 });
  if (!requireRole(session, 'admin')) return Response.json({ error: 'Admin access required' }, { status: 403 });

  const { id: userId, activeRole, email } = session.user;
  const context = { userId, activeRole, email };
  const canView = await isFeatureEnabled('admin.bookings.view', context, { strict: true });
  const canAct = canView && (action === 'view' ||
    await isFeatureEnabled(`admin.bookings.${action}`, context, { strict: true }));
  if (!canAct) return Response.json({ error: 'You do not have permission for this booking action.' }, { status: 403 });
  return null;
}

// Current arena boundary: the existing Court.owner field. Super Admin retains
// platform-wide oversight; ordinary Admins can only act on courts they own.
export async function bookingScopeForAdmin(session) {
  if (isSuperAdmin(session?.user?.email)) return {};
  const courts = await Court.find({ owner: session.user.id }).select('_id').lean();
  return { court: { $in: courts.map((court) => court._id) } };
}
