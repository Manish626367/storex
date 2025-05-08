import { auth } from "@/auth";
import { restoreEmployee } from "@/services/employeeServices";
import { NextResponse } from "next/server";

export const PATCH = auth(async (req,{params}) => {
    if (!req.auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const {id } =await params;

    try {
      const employee = await restoreEmployee(id);
      if(employee == null){return NextResponse.json({ error: "Failed to restore employee" }, { status: 401 });}
      return NextResponse.json({ employee }, { status: 200 });
    } catch (error) {
      console.error("Error adding employee:", error);
      return NextResponse.json({ error: "internal server error " }, { status: 500 });
    }
  });
