import Court from '@/models/Court';
import { isSuperAdmin } from '@/lib/roles';

// Current arena boundary: the existing Court.owner field. Super Admin retains
// platform-wide oversight; ordinary Admins can only act on courts they own.
export async function bookingScopeForAdmin(session) {
  if (isSuperAdmin(session?.user?.email)) return {};
  const courts = await Court.find({ owner: session.user.id }).select('_id').lean();
  return { court: { $in: courts.map((court) => court._id) } };
}
