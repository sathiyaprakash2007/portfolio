const express = require("express");

const {
  getExperience,
  createExperience,
  deleteExperience,
} = require("../controllers/experienceController");

const router = express.Router();

// GET experience
router.get("/", getExperience);

// CREATE experience
router.post("/", createExperience);

// DELETE experience
router.delete("/:id", deleteExperience);

module.exports = router;