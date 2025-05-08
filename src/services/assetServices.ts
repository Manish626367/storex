


import pool from "@/lib/db/db";
import camelcaseKeys from 'camelcase-keys';

// Add Asset
export const addAsset = async (
  brand: string,
  model: string,
  purchaseDate: Date,
  ownedBy: string,
  assetType: string,
  createdBy: string,
  serialNumber?: string,
  clientName?: string,
  warrantyExpiresDate?: Date,
  series?: string,
  processor?: string,
  RAM?: string,
  operatingSystem?: string,
  screenResolution?: string,
  storage?: string,
  charger?: string,
  IMEI1?: string,
  IMEI2?: string,
  simNo?: string,
  phoneNo?: string,
  acessoriesType?: string,
  capacity?: string,
  remark?: string
) => {
  try {
    await pool.query("BEGIN");

    const result = await pool.query(
      `
      INSERT INTO asset (
        serial_no, owned_by, asset_type, brand, model,
        purchase_date, warranty_expiry_date, client_name,
        asset_status, created_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING asset_id
      `,
      [
        serialNumber || null,
        ownedBy,
        assetType,
        brand,
        model,
        purchaseDate,
        warrantyExpiresDate || null,
        clientName || null,
        "Available",
        createdBy
      ]
    );

    const assetId = result.rows[0].asset_id;

    let detailQuery = "";
    let detailValues;

    switch (assetType) {
      case "laptop":
        detailQuery = `
          INSERT INTO laptop_details
          (asset_id, series, processor, ram, operating_system, screen_resolution, storage, charger) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        detailValues = [assetId, series, processor, RAM, operatingSystem, screenResolution, storage, charger];
        break;

      case "monitor":
        detailQuery = `
          INSERT INTO monitor_details (asset_id, screen_resolution)
          VALUES ($1, $2)
        `;
        detailValues = [assetId, screenResolution];
        break;

      case "hard disk":
        detailQuery = `
          INSERT INTO hard_disk_details (asset_id, storage)
          VALUES ($1, $2)
        `;
        detailValues = [assetId, storage];
        break;

      case "pen drive":
        detailQuery = `
          INSERT INTO pen_drive_details (asset_id, storage)
          VALUES ($1, $2)
        `;
        detailValues = [assetId, storage];
        break;

      case "mobile":
        detailQuery = `
          INSERT INTO mobile_details (asset_id, operating_system, imei_1, imei_2, ram) 
          VALUES ($1, $2, $3, $4, $5)
        `;
        detailValues = [assetId, operatingSystem, IMEI1, IMEI2, RAM];
        break;

      case "sim":
        detailQuery = `
          INSERT INTO sim_details (asset_id, sim_no, phone_number) 
          VALUES ($1, $2, $3)
        `;
        detailValues = [assetId, simNo, phoneNo];
        break;

      case "accessories":
        detailQuery = `
          INSERT INTO accessories_details (asset_id, accessories_type, remark) 
          VALUES ($1, $2, $3)
          RETURNING accessories_id
        `;
        detailValues = [assetId, acessoriesType, remark];

        const accessoriesResult = await pool.query(detailQuery, detailValues);
        const accessoriesId = accessoriesResult.rows[0].accessories_id;

        if (acessoriesType === "RAM") {
          await pool.query(
            `INSERT INTO ram_accessorie_details (accessories_id, capacity) VALUES ($1, $2)`,
            [accessoriesId, capacity]
          );
        }
        break;
    }

    if (detailQuery && assetType !== "accessories") {
      await pool.query(detailQuery, detailValues);
    }

    await pool.query("COMMIT");
    return true;
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error adding asset:", error);
    return null;
  }
};

// Get Asset by ID
export const getAssetById = async (asset_id: string) => {
  try {
    const assetTypeResult = await pool.query(
      `SELECT asset_type FROM asset WHERE asset_id = $1`,
      [asset_id]
    );

    const assetType = assetTypeResult.rows[0].asset_type;
    const validTypes = ["laptop", "monitor", "hard_disk", "pen_drive", "mobile", "sim", "accessories"];

    if (!validTypes.includes(assetType)) {
      throw new Error(`Unsupported asset type: ${assetType}`);
    }

    const detailTable = `${assetType}_details`;

    const result = await pool.query(
      `
      SELECT a.*, d.* 
      FROM asset a 
      JOIN ${detailTable} d ON d.asset_id = a.asset_id 
      WHERE a.asset_id = $1
      `,
      [asset_id]
    );

    const camelResult = camelcaseKeys(result.rows[0], { deep: true });
    console.log("camelResult -- ", camelResult);

    return camelResult;
  } catch (error) {
    console.error("Error in getAssetById:", error);
    return null;
  }
};

// Get All Assets with Assigned Employee
export const getAllAssets = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*, 
        e.name as assigned_employee
      FROM asset a
      LEFT JOIN assigned assign ON assign.asset_id = a.asset_id
      LEFT JOIN employee e ON e.emp_id = assign.emp_id
    `);

    console.log("result --- ", result.rows);
    const camelResult = camelcaseKeys(result.rows, { deep: true });

    return camelResult;
  } catch (error) {
    console.error("Error in getAllAssets:", error);
    return null;
  }
};

// Delete Asset (Archive)
export const deleteAsset = async (
  assetId: string,
  archivedReason: string,
  activeUserId: string
) => {
  try {
    await pool.query(
      `
      UPDATE asset 
      SET archived_at = current_timestamp, 
          archived_reason = $1, 
          archived_by = $2 
      WHERE asset_id = $3 
      
      `,
      [archivedReason, activeUserId, assetId]
    );

    return true
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Restore Asset
export const restoreAsset = async (assetId: string) => {
  try {
    const result = await pool.query(
      `
      UPDATE asset 
      SET archived_at = NULL, 
          archived_reason = NULL, 
          archived_by = NULL 
      WHERE asset_id = $1 
      RETURNING *
      `,
      [assetId]
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};



// update asset 
export const updateAsset = async (
  brand: string,
  model: string,
  purchaseDate: Date,
  ownedBy: string,
  assetType: string,
  updatedBy: string,
  asset_id: string,
  serialNumber?: string,
  clientName?: string,
  warrantyExpiresDate?: Date,
  series?: string,
  processor?: string,
  RAM?: string,
  operatingSystem?: string,
  screenResolution?: string,
  storage?: string,
  charger?: string,
  IMEI1?: string,
  IMEI2?: string,
  simNo?: string,
  phoneNo?: string,
  acessoriesType?: string,
  capacity?: string,
  remark?: string
) => {
  try {
    await pool.query("BEGIN");

    await pool.query(
      `
      UPDATE asset SET 
        serial_no = $1,
        owned_by = $2,
        brand = $3,
        model = $4,
        purchase_date = $5,
        warranty_expiry_date = $6,
        client_name = $7,
        updated_by = $8,
        updated_at = NOW(),
        asset_type = $9
      WHERE asset_id = $10
      `,
      [
        serialNumber || null,
        ownedBy,
        brand,
        model,
        purchaseDate,
        warrantyExpiresDate || null,
        clientName || null,
        updatedBy,
        assetType,
        asset_id
      ]
    );


    const deleteAndInsert = async (
      deleteQuery: string,
      insertQuery: string,
      values: (string | undefined)[]
    ) => {
      await pool.query(deleteQuery, [asset_id]);
      await pool.query(insertQuery, values);
    };

    switch (assetType) {
      case "laptop":
        await deleteAndInsert(
          `DELETE FROM laptop_details WHERE asset_id = $1`,
          `INSERT INTO laptop_details 
            (asset_id, series, processor, ram, operating_system, screen_resolution, storage, charger)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [asset_id, series, processor, RAM, operatingSystem, screenResolution, storage, charger]
        );
        break;

      case "monitor":
        await deleteAndInsert(
          `DELETE FROM monitor_details WHERE asset_id = $1`,
          `INSERT INTO monitor_details (asset_id, screen_resolution) VALUES ($1, $2)`,
          [asset_id, screenResolution]
        );
        break;

      case "hard_disk":
      case "pen_drive":
        const table = assetType === "hard_disk" ? "hard_disk_details" : "pen_drive_details";
        await deleteAndInsert(
          `DELETE FROM ${table} WHERE asset_id = $1`,
          `INSERT INTO ${table} (asset_id, storage) VALUES ($1, $2)`,
          [asset_id, storage]
        );
        break;

      case "mobile":
        await deleteAndInsert(
          `DELETE FROM mobile_details WHERE asset_id = $1`,
          `INSERT INTO mobile_details 
            (asset_id, operating_system, imei_1, imei_2, ram) 
            VALUES ($1, $2, $3, $4, $5)`,
          [asset_id, operatingSystem, IMEI1, IMEI2, RAM]
        );
        break;

      case "sim":
        await deleteAndInsert(
          `DELETE FROM sim_details WHERE asset_id = $1`,
          `INSERT INTO sim_details (asset_id, sim_no, phone_number) VALUES ($1, $2, $3)`,
          [asset_id, simNo, phoneNo]
        );
        break;

      case "accessories":
        const oldAccessories = await pool.query(
          `SELECT accessories_id, accessories_type FROM accessories_details WHERE asset_id = $1`,
          [asset_id]
        );
        const oldAccessoriesId = oldAccessories.rows[0]?.accessories_id;
        const oldType = oldAccessories.rows[0]?.accessories_type;

        if (oldType === "RAM" && oldAccessoriesId) {
          await pool.query(`DELETE FROM ram_accessorie_details WHERE accessories_id = $1`, [oldAccessoriesId]);
        }

        await pool.query(`DELETE FROM accessories_details WHERE asset_id = $1`, [asset_id]);

        const accessoriesResult = await pool.query(
          `INSERT INTO accessories_details 
            (asset_id, accessories_type, remark) 
            VALUES ($1, $2, $3)
            RETURNING accessories_id`,
          [asset_id, acessoriesType, remark]
        );

        const newAccessoriesId = accessoriesResult.rows[0]?.accessories_id;

        if (acessoriesType === "RAM" && newAccessoriesId) {
          await pool.query(
            `INSERT INTO ram_accessorie_details (accessories_id, capacity) VALUES ($1, $2)`,
            [newAccessoriesId, capacity]
          );
        }
        break;
    }

    await pool.query("COMMIT");
    return true;

  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error in updateAsset:", error);
    return null;
  }
};
