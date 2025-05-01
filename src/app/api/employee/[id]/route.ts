import { auth } from "@/auth";
import { checkUserExistOrNot, editEmployeeDetails } from "@/services/employeeServices";
import { NextResponse } from "next/server";

export const PATCH = auth(async (req,{params}) => {
    if (!req.auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
  
    try {
      const { name, email, phoneNumber, employeeType, employeeStatus } = await req.json();
      const {id} = await params;
      console.log("employeestatus" , employeeStatus)
      const ifUserExist = await checkUserExistOrNot(email)
      console.log("ifuserexist -- ",ifUserExist);
      console.log("empId -- ",id)
      if(!ifUserExist){
         return NextResponse.json({ error: "email already exist " }, { status: 409 });
      }
      const employee = await editEmployeeDetails(name, email, phoneNumber, employeeType, employeeStatus , id);
      return NextResponse.json({ employee }, { status: 200 });
    } catch (error) {
      console.error("Error adding employee:", error);
      return NextResponse.json({ error: "Failed to add employee" }, { status: 500 });
    }
  });
  


