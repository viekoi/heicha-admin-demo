import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import NavBar from '@/components/NavBar';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  

  return (
    <>
      <NavBar/>
      {children}
    </>
  );
};