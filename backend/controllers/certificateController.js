const { pool } = require("../config/db");

// ==========================================
// GET ALL CERTIFICATES
// ==========================================

const getCertificates = async (req, res) => {
  try {
    const [certificates] = await pool.query(
      "SELECT * FROM certificates ORDER BY issue_date DESC"
    );

    res.status(200).json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    console.error(
      "Error fetching certificates:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
    });
  }
};

// ==========================================
// CREATE CERTIFICATE
// ==========================================

const createCertificate = async (req, res) => {
  try {
    const {
      title,
      issuer,
      issue_date,
      credential_id,
      credential_url,
      description,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Certificate title is required",
      });
    }

    // Uploaded image path
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    const [result] = await pool.query(
      `INSERT INTO certificates
      (
        title,
        issuer,
        issue_date,
        credential_id,
        credential_url,
        image,
        description
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        issuer || "",
        issue_date || null,
        credential_id || "",
        credential_url || "",
        image,
        description || "",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Certificate created successfully",
      certificateId: result.insertId,
      image,
    });
  } catch (error) {
    console.error(
      "Error creating certificate:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to create certificate",
    });
  }
};

// ==========================================
// DELETE CERTIFICATE
// ==========================================

const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM certificates WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting certificate:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete certificate",
    });
  }
};

module.exports = {
  getCertificates,
  createCertificate,
  deleteCertificate,
};