const { pool } = require("../config/db");

// ==========================================
// GET ALL EDUCATION
// GET /api/education
// ==========================================

const getEducation = async (req, res) => {
  try {
    const [education] = await pool.query(
      "SELECT * FROM education ORDER BY start_year DESC"
    );

    res.status(200).json({
      success: true,
      count: education.length,
      education,
    });
  } catch (error) {
    console.error("Error fetching education:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch education",
    });
  }
};

// ==========================================
// CREATE EDUCATION
// POST /api/education
// ==========================================

const createEducation = async (req, res) => {
  try {
    const {
      institution,
      degree,
      field,
      description,
      start_year,
      end_year,
      location,
    } = req.body;

    if (!institution || !degree) {
      return res.status(400).json({
        success: false,
        message: "Institution and degree are required",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO education
      (
        institution,
        degree,
        field,
        description,
        start_year,
        end_year,
        location
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        institution,
        degree,
        field || "",
        description || "",
        start_year || null,
        end_year || null,
        location || "",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Education created successfully",
      educationId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating education:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create education",
    });
  }
};

// ==========================================
// DELETE EDUCATION
// DELETE /api/education/:id
// ==========================================

const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM education WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting education:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete education",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getEducation,
  createEducation,
  deleteEducation,
};