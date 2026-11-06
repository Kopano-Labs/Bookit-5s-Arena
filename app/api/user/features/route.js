export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/getSession';
import { isSuperAdmin } from '@/lib/roles';
import { resolveFeatureAccess } from '@/lib/features';
import connectDB from '@/lib/mongodb';
import FeatureAccess from '@/models/FeatureAccess';

// GET /api/user/features
// Returns a flat map of featureKey → boolean for the current user's active role.
// Super admin gets everything as true.
export async function GET() {
  try {
    const session = await getAuthSession();
    const userId = session?.user?.id || session?.user?.email;
    const activeRole = session?.user?.activeRole || 'user';
    const email = session?.user?.email;

    // Super admin: all features enabled
    if (email && isSuperAdmin(email)) {
      await connectDB();
      const all = await FeatureAccess.find({}).select('featureKey').lean();
      const result = {};
      for (const f of all) result[f.featureKey] = true;
      return NextResponse.json(result);
    }

    await connectDB();
    const features = await FeatureAccess.find({}).lean();

    const result = {};
    for (const f of features) {
      result[f.featureKey] = resolveFeatureAccess(f, { userId, activeRole, email });
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
