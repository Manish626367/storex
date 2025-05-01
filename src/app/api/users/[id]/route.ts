

import { auth } from "@/auth";
import { deleteUser } from "@/services/userServices";
import { NextResponse } from "next/server";

export const PATCH = auth(async (req, { params }) => {
    if (!req.auth) {
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 }
        );
    }

    try {
        const {id} = await params;
        const { activeUserId ,email} = await req.json();

        const user = await deleteUser(id, activeUserId , email);
        
        return NextResponse.json(
            { message: "Successfully deleted", user },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: `internal server error ${error}` },
            { status: 500 }
        );
    }
});
