const express = require("express");

const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectsController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// GET ALL PROJECTS
// GET /api/projects
// PUBLIC
// ==========================================

router.get("/", getProjects);

// ==========================================
// GET SINGLE PROJECT
// GET /api/projects/:id
// PUBLIC
// ==========================================

router.get("/:id", getProjectById);

// ==========================================
// CREATE PROJECT
// POST /api/projects
// ADMIN ONLY
// ==========================================

router.post(
  "/",
  authMiddleware,
  createProject
);

// ==========================================
// UPDATE PROJECT
// PUT /api/projects/:id
// ADMIN ONLY
// ==========================================

router.put(
  "/:id",
  authMiddleware,
  updateProject
);

// ==========================================
// DELETE PROJECT
// DELETE /api/projects/:id
// ADMIN ONLY
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteProject
);

module.exports = router;