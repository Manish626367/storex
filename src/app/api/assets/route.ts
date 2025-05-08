

import { auth } from "@/auth";
import { addAsset, getAllAssets } from "@/services/assetServices";
import { NextResponse } from "next/server";


//-------------------------------------------------------------------------------
// -------- Add new asset -------------------------------------------------------


export const POST = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const {
      brand,
      model,
      purchaseDate,
      ownedBy,
      assetType,
      createdBy,
      serialNumber,
      clientName,
      warrantyExpiresDate,
      series,
      processor,
      RAM,
      operatingSystem,
      screenResolution,
      storage,
      charger,
      IMEI1,
      IMEI2,
      simNo,
      phoneNo,
      acessoriesType,
      capacity,
      remark
    } = body;

    const result = await addAsset(
      brand,
      model,
      new Date(purchaseDate),
      ownedBy,
      assetType,
      createdBy,
      serialNumber,
      clientName,
      warrantyExpiresDate ? new Date(warrantyExpiresDate) : undefined,
      series,
      processor,
      RAM,
      operatingSystem,
      screenResolution,
      storage,
      charger,
      IMEI1,
      IMEI2,
      simNo,
      phoneNo,
      acessoriesType,
      capacity,
      remark
    );

    if (!result) {
      return NextResponse.json({ error: "Failed to insert asset"}, { status: 500 });
    }

    return NextResponse.json({ message: "Asset added successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error adding asset:", error);
    return NextResponse.json({ error: "Failed to add asset" }, { status: 500 });
  }
});





//------------------------------------------------------------------------------------
//-------------------------- GET all the assets --------------------------------------



export const GET = auth(async function GET(req) {

  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  const asset = await getAllAssets();
  return NextResponse.json({ asset });


})




