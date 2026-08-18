import { redirect } from 'next/navigation';

export default function BlogIndexPage() {
  redirect('/news?organ=blog');
}
