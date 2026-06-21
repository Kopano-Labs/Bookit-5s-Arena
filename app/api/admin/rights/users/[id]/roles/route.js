export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/getSession';
import { isSuperAdmin, SUPER_ADMIN_EMAIL, ALL_ROLES } from '@/lib/roles';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function PATCH(request, { params }) {
  try {
    const session = await getAuthSession();
    if (!session || !isSuperAdmin(session.user.email)) {
      return NextResponse.json({ error: 'Super admin access required.' }, { status: 403 });
    }

    const { id } = params;
    const { roles } = await request.json();

    if (!Array.isArray(roles) || roles.length === 0) {
      return NextResponse.json({ error: 'roles must be a non-empty array.' }, { status: 400 });
    }

    let nextRoles = [...new Set(roles)].filter((r) => ALL_ROLES.includes(r));
    if (!nextRoles.includes('user')) {
      nextRoles = ['user', ...nextRoles.filter((r) => r !== 'user')];
    }
    if (!nextRoles.length) {
      return NextResponse.json({ error: 'roles must include at least user.' }, { status: 400 });
    }

    await connectDB();
    const target = await User.findById(id);
    if (!target) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    const targetEmail = String(target.email || '').toLowerCase().trim();
    if (targetEmail !== SUPER_ADMIN_EMAIL) {
      if (nextRoles.length > 3) {
        return NextResponse.json(
          { error: 'A user may hold at most three roles (super admin excluded).' },
          { status: 400 },
        );
      }
      if (new Set(nextRoles).size === ALL_ROLES.length) {
        return NextResponse.json(
          { error: 'Only the super admin may hold every role slot.' },
          { status: 403 },
        );
      }
      if (nextRoles.includes('admin') && nextRoles.includes('manager')) {
        nextRoles = nextRoles.filter((r) => r !== 'admin');
      }
    }

    // Cannot modify the super admin's roles
    if (target.email === SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Super admin roles cannot be modified.' },
        { status: 403 }
      );
    }

    target.roles = nextRoles;
    await target.save();

    return NextResponse.json({ success: true, user: { _id: target._id, email: target.email, roles: target.roles } });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
