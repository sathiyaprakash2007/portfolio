const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  getCertificates,
  createCertificate,
  deleteCertificate,
} = require("../controllers/certificateController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// MULTER STORAGE
// ==========================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);

    const filename =
      "certificate-" +
      Date.now() +
      extension;

    cb(null, filename);
  },
});

// ==========================================
// FILE FILTER
// ==========================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ==========================================
// GET CERTIFICATES
// PUBLIC
// ==========================================

router.get("/", getCertificates);

// ==========================================
// CREATE CERTIFICATE
// ADMIN ONLY
// ==========================================

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createCertificate
);

// ==========================================
// DELETE CERTIFICATE
// ADMIN ONLY
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteCertificate
);

module.exports = router;