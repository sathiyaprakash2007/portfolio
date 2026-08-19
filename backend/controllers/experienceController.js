const { pool } = require("../config/db");

// ==========================================
// GET ALL EXPERIENCE
// GET /api/experience
// ==========================================

const getExperience = async (req, res) => {
  try {
    const [experience] = await pool.query(
      "SELECT * FROM experience ORDER BY start_date DESC"
    );

    res.status(200).json({
      success: true,
      count: experience.length,
      experience,
    });
  } catch (error) {
    console.error("Error fetching experience:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch experience",
    });
  }
};

// ==========================================
// CREATE EXPERIENCE
// POST /api/experience
// ==========================================

const createExperience = async (req, res) => {
  try {
    const {
      company,
      role,
      description,
      start_date,
      end_date,
      location,
      certificate,
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: "Company and role are required",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO experience
      (
        company,
        role,
        description,
        start_date,
        end_date,
        location,
        certificate
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        company,
        role,
        description || "",
        start_date || null,
        end_date || null,
        location || "",
        certificate || "",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Experience created successfully",
      experienceId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating experience:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create experience",
    });
  }
};

// ==========================================
// DELETE EXPERIENCE
// DELETE /api/experience/:id
// ==========================================

const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM experience WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting experience:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete experience",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getExperience,
  createExperience,
  deleteExperience,
};