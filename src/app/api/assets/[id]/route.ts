import { auth } from "@/auth";
import { deleteAsset, getAssetById, updateAsset } from "@/services/assetServices";
import { NextResponse } from "next/server";

  export const GET = auth(async function GET(req,{params}) {

    const {id} = await params;
    
    if (req.auth){
        const asser = await getAssetById(id);
        return NextResponse.json({ asser});
    }
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  })

//----------------------------------------------------------------
//  delete a asset 



  export const DELETE = auth(async (req,{params}) => {

    if (!req.auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const {id} = await params;
    const {archived_reason,activeUserId} = await req.json();

    try {
      await deleteAsset(id,archived_reason,activeUserId);
      return NextResponse.json({ message:"deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting asset:", error);
      return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 });
    }
  });



    //----------------------------------------------------
  // ---------- change asset details -------------------


   
   export const PATCH = auth(async (req,{params}) => {
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
          updatedBy,
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
     
         const {id} = await params;

          const result = await updateAsset(
               brand,
               model,
               new Date(purchaseDate),
               ownedBy,
               assetType,
               updatedBy, 
               id,
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
               remark,
             
             );
        

             if (!result) {
                return NextResponse.json({ error: "Failed to update asset" }, { status: 500 });
              }
          
              return NextResponse.json({ message: "Asset updated successfully" }, { status: 200 });
            } catch (error) {
              console.error( error);
              return NextResponse.json({ error: "Failed to update asset" }, { status: 500 });
            }
          });
  
   
