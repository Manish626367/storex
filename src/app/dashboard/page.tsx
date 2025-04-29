import { auth } from '@/auth';
import { SignOutButton } from '@/app/dashboard/sign-out-button'

export default async function DashboardPage() {
  const session = await auth();
  console.log("-->",session); 

  return (
    <div>
      <h1>Dashboard Page</h1>
      <p>Welcome, {session?.user?.name}</p>
      <SignOutButton />
    </div>
  );
}