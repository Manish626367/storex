

import { NextResponse } from 'next/server';



import { auth } from "@/auth"
import { checkUserExistOrNot, createEmployee, getAllEmployees } from '@/services/employeeServices';


//  get all employees
export const GET = auth(async function GET(req) {
  
  if (req.auth){
      const employees = await getAllEmployees();
      return NextResponse.json({ employees });
  }
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
})



//-------- add new employee
export const POST = auth(async (req) => {
    if (!req.auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
  
    try {
      const { name, email, phoneNumber, employeeType, employeeStatus, addedBy } = await req.json();
    //   console.log("employeestatus" , employeeStatus)
      const ifUserExist = await checkUserExistOrNot(email)
    //   console.log("ifuserexist -- ",ifUserExist);
      if(!ifUserExist){
         return NextResponse.json({ error: "email already exist " }, { status: 409 });
      }
      const employee = await createEmployee(name, email, phoneNumber, employeeType, employeeStatus, addedBy);
      return NextResponse.json({ employee }, { status: 200 });
    } catch (error) {
      console.error("Error adding employee:", error);
      return NextResponse.json({ error: "Failed to add employee" }, { status: 500 });
    }
  });
  



