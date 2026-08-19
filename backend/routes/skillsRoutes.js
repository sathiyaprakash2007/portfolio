const express = require("express");

const {
  getSkills,
  createSkill,
  deleteSkill,
} = require("../controllers/skillsController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// GET ALL SKILLS
// PUBLIC
// ==========================================

router.get("/", getSkills);

// ==========================================
// CREATE SKILL
// ADMIN ONLY
// ==========================================

router.post(
  "/",
  authMiddleware,
  createSkill
);

// ==========================================
// DELETE SKILL
// ADMIN ONLY
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteSkill
);

module.exports = router;