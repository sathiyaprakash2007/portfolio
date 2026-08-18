const express = require("express");

const {
  getEducation,
  createEducation,
  deleteEducation,
} = require("../controllers/educationController");

const router = express.Router();

// GET education
router.get("/", getEducation);

// CREATE education
router.post("/", createEducation);

// DELETE education
router.delete("/:id", deleteEducation);

module.exports = router;