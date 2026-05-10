import { redirect } from 'next/navigation';

/** Canonical admin entry: avoids bare /admin with no segment page (404 or odd edge cases). */
export default function AdminIndexPage() {
  redirect('/admin/dashboard');
}
