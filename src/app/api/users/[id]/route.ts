import { deleteUser } from "@/services/userServices";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest){
    try {
         const {auth_user_id} = await req.json();
         const  user = await deleteUser(auth_user_id);
         return NextResponse.json({message:"sucessfully deleted " , user})

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
