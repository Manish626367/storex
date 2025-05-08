import { auth } from "@/auth";
import { restoreAsset } from "@/services/assetServices";
import { NextResponse } from "next/server";

export const PATCH = auth(async (req,{params}) => {
    if (!req.auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const {id } =await params;

    try {
      const asset = await restoreAsset(id);
      if(asset == null){return NextResponse.json({ error: "Failed to restore asset" }, { status: 401 });}
      return NextResponse.json({ asset }, { status: 200 });
    } catch (error) {
      console.error( error);
      return NextResponse.json({ error: "internal server error " }, { status: 500 });
    }
  });
