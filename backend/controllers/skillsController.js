const { pool } = require("../config/db");

// ==========================================
// GET ALL SKILLS
// GET /api/skills
// ==========================================

const getSkills = async (req, res) => {
  try {
    const [skills] = await pool.query(
      "SELECT * FROM skills ORDER BY category, name"
    );

    res.status(200).json({
      success: true,
      count: skills.length,
      skills: skills,
    });
  } catch (error) {
    console.error("Error fetching skills:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
    });
  }
};

// ==========================================
// CREATE SKILL
// POST /api/skills
// ==========================================

const createSkill = async (req, res) => {
  try {
    const {
      name,
      category,
      level,
      icon,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO skills
      (name, category, level, icon)
      VALUES (?, ?, ?, ?)`,
      [
        name,
        category,
        level || "",
        icon || "",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      skillId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating skill:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create skill",
    });
  }
};

// ==========================================
// DELETE SKILL
// DELETE /api/skills/:id
// ==========================================

const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM skills WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting skill:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete skill",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getSkills,
  createSkill,
  deleteSkill,
};