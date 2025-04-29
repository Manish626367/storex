'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function SignOutButton() {
  const router = useRouter();

  const session = useSession();
  console.log("in client sessions : ", session)

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <Button onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}