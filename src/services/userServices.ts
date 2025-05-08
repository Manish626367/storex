import pool from '@/lib/db/db';
import camelcaseKeys from 'camelcase-keys'

// Get all authenticated users
export const getAllUsers = async () => {
  try {
    const result = await pool.query(
      `SELECT * FROM auth_table 
       WHERE archived_at IS NULL 
       ORDER BY created_at, updated_at`
    );
    
    const camelResult = camelcaseKeys(result.rows[0], { deep: true });
    return camelResult;

  } catch (error) {
    console.log(error);
    return null;
  }
};

// Add a new user
export const createUser = async (email: string, addedBy: string) => {
  try {
    const result = await pool.query(
      `INSERT INTO auth_table (email, created_at, updated_at, added_by) 
       VALUES ($1, NOW(), NOW(), $2) 
       RETURNING *`,
      [email, addedBy]
    );
    return result.rows;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Delete an authenticated user
export const deleteUser = async (
  userId: string,
  activeUserId: string,
  email: string
) => {
  try {


    const result = await pool.query(
      `UPDATE auth_table 
       SET archived_at = CURRENT_TIMESTAMP, deleted_by = $1 
       WHERE auth_user_id = $2 
       RETURNING *`,
      [activeUserId, userId]
    );

    const getUserId = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    await pool.query(
      `UPDATE users SET archived_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [getUserId.rows[0].id]
    );

    await pool.query(
      `DELETE FROM sessions WHERE "userId" = $1`,
      [getUserId.rows[0].id]
    );

    return result.rows;
  } catch (error) {
    console.log(error);
    return null;
  }
};
