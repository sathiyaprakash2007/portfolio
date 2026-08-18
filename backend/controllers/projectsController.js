const { pool } = require("../config/db");

// ==========================================
// GET ALL PROJECTS
// GET /api/projects
// ==========================================

const getProjects = async (req, res) => {
  try {
    const [projects] = await pool.query(
      "SELECT * FROM projects ORDER BY created_at DESC"
    );

    res.status(200).json({
      success: true,
      count: projects.length,
      projects: projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

// ==========================================
// GET SINGLE PROJECT
// GET /api/projects/:id
// ==========================================

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const [projects] = await pool.query(
      "SELECT * FROM projects WHERE id = ?",
      [id]
    );

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project: projects[0],
    });
  } catch (error) {
    console.error("Error fetching project:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};

// ==========================================
// CREATE PROJECT
// POST /api/projects
// ==========================================

const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      github,
      live_demo,
      image,
      category,
      featured,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO projects
      (
        title,
        description,
        technologies,
        github,
        live_demo,
        image,
        category,
        featured
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        technologies || "",
        github || "",
        live_demo || "",
        image || "",
        category || "",
        featured ? 1 : 0,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      projectId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating project:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

// ==========================================
// UPDATE PROJECT
// PUT /api/projects/:id
// ==========================================

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      technologies,
      github,
      live_demo,
      image,
      category,
      featured,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const [result] = await pool.query(
      `UPDATE projects
       SET
         title = ?,
         description = ?,
         technologies = ?,
         github = ?,
         live_demo = ?,
         image = ?,
         category = ?,
         featured = ?
       WHERE id = ?`,
      [
        title,
        description,
        technologies || "",
        github || "",
        live_demo || "",
        image || "",
        category || "",
        featured ? 1 : 0,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
    });
  } catch (error) {
    console.error("Error updating project:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

// ==========================================
// DELETE PROJECT
// DELETE /api/projects/:id
// ==========================================

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM projects WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};