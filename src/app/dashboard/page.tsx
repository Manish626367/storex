import { auth } from '@/auth';
import { SignOutButton } from '@/app/dashboard/sign-out-button'
// import { redirect } from 'next/navigation';


export default async function DashboardPage() {
  const session = await auth();


  // if(!session?.user) {
  //     redirect('/login')
  // }
  // console.log("-->",session); 

  return (
    <div>
      <h1>Dashboard Page</h1>
      <p>Welcome, {session?.user?.name}</p>
      <SignOutButton />
    </div>
  );
}