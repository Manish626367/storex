import { auth } from "@/auth";
import { checkUserExistOrNot, deleteEmployee, editEmployeeDetails, getEmailFromId, getEmployeeById } from "@/services/employeeServices";
import { NextResponse } from "next/server";

export const PATCH = auth(async (req,{params}) => {
    if (!req.auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
  
    try {
      const { name, email, phoneNumber, employeeType, employeeStatus } = await req.json();
  
      const {id} = await params;
     
      const getEmail = await getEmailFromId(id);
    
      if(getEmail != email){
        const ifUserExist = await checkUserExistOrNot(email)
        if(!ifUserExist){
            return NextResponse.json({ error: "email already exist " }, { status: 409 });
         }
      }
    
      const employee = await editEmployeeDetails(name, email, phoneNumber, employeeType, employeeStatus , id);
      return NextResponse.json({ employee }, { status: 200 });
    } catch (error) {
      console.error("Error adding employee:", error);
      return NextResponse.json({ error: "Failed to add employee" }, { status: 500 });
    }
  });



// delete a employee

  export const DELETE = auth(async (req,{params}) => {

    if (!req.auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const {id} = await params;
    const {archived_reason,activeUserId} = await req.json();

    try {
      const employee = await deleteEmployee(id,archived_reason,activeUserId);
      return NextResponse.json({ employee }, { status: 200 });
    } catch (error) {
      console.error("Error deleting employee:", error);
      return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
    }
  });



  // get a particular employee 

  export const GET = auth(async function GET(req,{params}) {

    const {id} = await params;
    
    if (req.auth){
        const employee = await getEmployeeById(id);
        return NextResponse.json({ employee});
    }
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  })


