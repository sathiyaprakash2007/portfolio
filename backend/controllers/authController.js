const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

// ==========================================
// ADMIN LOGIN
// ==========================================

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Find admin
    const [admins] = await pool.query(
      "SELECT * FROM admins WHERE username = ? LIMIT 1",
      [username]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const admin = admins[0];

    // Compare password with hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });

  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

module.exports = {
  loginAdmin,
};