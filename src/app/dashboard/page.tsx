import authOptions from '@/lib/auth.config';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  // console.log(session);

  if (session === null) {
    return redirect('/login');
  } else {
    redirect('/dashboard/overview');
  }
}
