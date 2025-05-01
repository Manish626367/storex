

import { NextResponse } from 'next/server';



import { auth } from "@/auth"
import { checkUserExistOrNot, createEmployee } from '@/services/employeeServices';


//-------- add new employee
export const POST = auth(async (req) => {
    if (!req.auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
  
    try {
      const { name, email, phoneNumber, employeeType, employeeStatus, addedBy } = await req.json();
      const ifUserExist = await checkUserExistOrNot(email)
      if(ifUserExist){
         return NextResponse.json({ error: "email already exist " }, { status: 409 });
      }
      const users = await createEmployee(name, email, phoneNumber, employeeType, employeeStatus, addedBy);
      return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
      console.error("Error adding employee:", error);
      return NextResponse.json({ error: "Failed to add employee" }, { status: 500 });
    }
  });
  

