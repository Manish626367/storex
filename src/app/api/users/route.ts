

import { NextResponse } from 'next/server';
import { getAllUsers, createUser } from '@/services/userServices';


import { auth } from "@/auth"

//--------- get all authenticated user 
export const GET = auth(async function GET(req) {
  console.log("req.auth --- ",req.auth)
  if (req.auth){
      const users = await getAllUsers();
      return NextResponse.json({ users });
  }
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
})

//-------- add authenticated user
export const POST = auth(async (req) => {
    if (!req.auth) { return NextResponse.json({ error: "Not authenticated" }, { status: 401 } );}
    
    const { email ,addedBy} = await req.json();
        const users = await createUser( email , addedBy);
    return NextResponse.json( { users }, { status: 200 });
})

