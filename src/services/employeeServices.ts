

import pool from "@/lib/db/db";
import camelcaseKeys from 'camelcase-keys';

// Add a new employee
export const createEmployee = async (
  name: string,
  email: string,
  phoneNumber: string,
  employeeType: string,
  employeeStatus: string,
  addedBy: string
) => {
  try {
    const result = await pool.query(
      `INSERT INTO employee (name, email, phone_number, emp_type, status, added_by) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, email, phoneNumber, employeeType, employeeStatus, addedBy]
    );
    return result.rows;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Get email from employee ID
export const getEmailFromId = async (id: string) => {
  try {
    const result = await pool.query(
      `SELECT email FROM employee WHERE emp_id = $1`,
      [id]
    );
    return result.rows[0].email;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Check if user exists by email
export const checkUserExistOrNot = async (email: string) => {
  try {
    const result = await pool.query(
      `SELECT * FROM employee WHERE email = $1`,
      [email]
    );
    return result.rowCount === 0;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Get all employees
export const getAllEmployees = async () => {
  try {
    const query = `SELECT * FROM employee ORDER BY updated_at DESC`;
    const result = await pool.query(query);
    const camelResult = camelcaseKeys(result.rows[0], { deep: true });
    return camelResult;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Edit employee details
export const editEmployeeDetails = async (
  name: string,
  email: string,
  phoneNumber: string,
  employeeType: string,
  employeeStatus: string,
  empId: string
) => {
  try {
    const result = await pool.query(
      `UPDATE employee 
       SET email = $1, name = $2, phone_number = $3, emp_type = $4, status = $5, updated_at = current_timestamp 
       WHERE emp_id = $6 
       RETURNING *`,
      [email, name, phoneNumber, employeeType, employeeStatus, empId]
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Delete an employee
export const deleteEmployee = async (
  empId: string,
  archivedReason: string,
  activeUserId: string
) => {
  try {
    const result = await pool.query(
      `UPDATE employee 
       SET archived_at = current_timestamp, archived_reason = $1, archived_by = $2 
       WHERE emp_id = $3 
       RETURNING *`,
      [archivedReason, activeUserId, empId]
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Restore a deleted employee
export const restoreEmployee = async (empId: string) => {
  try {
    const result = await pool.query(
      `UPDATE employee 
       SET archived_at = null, updated_at = current_timestamp, archived_reason = null, archived_by = null 
       WHERE emp_id = $1 
       RETURNING *`,
      [empId]
    );
    const camelResult = camelcaseKeys(result.rows[0], { deep: true });
    return camelResult;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Get employee by ID
export const getEmployeeById = async (empId: string) => {
  try {
    const result = await pool.query(
      `SELECT * FROM employee WHERE emp_id = $1`,
      [empId]
    );
    const camelResult = camelcaseKeys(result.rows[0], { deep: true });
    return camelResult;
  } catch (error) {
    console.log(error);
    return null;
  }
};


   

