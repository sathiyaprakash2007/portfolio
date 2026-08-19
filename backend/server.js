const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// ==========================================
// DATABASE
// ==========================================

const { pool } = require("./config/db");

// ==========================================
// EMAIL
// ==========================================

const {
  verifyMailer,
} = require("./config/mailer");

// ==========================================
// ROUTES
// ==========================================

const projectRoutes = require("./routes/projectsRoutes");
const skillsRoutes = require("./routes/skillsRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const educationRoutes = require("./routes/educationRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const messageRoutes = require("./routes/messageRoutes");
const authRoutes = require("./routes/authRoutes");

// ==========================================
// EXPRESS APP
// ==========================================

const app = express();

const PORT = process.env.PORT || 5000;

// ==========================================
// CORS
// ==========================================

// Frontend addresses allowed to access backend
const allowedOrigins = [
  "http://localhost:3000",
  "http://10.40.36.192:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      // Example: Postman
      if (!origin) {
        return callback(null, true);
      }

      // Allow known frontend addresses
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(
        "❌ CORS blocked:",
        origin
      );

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==========================================
// STATIC UPLOADS
// ==========================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ==========================================
// BASIC TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Portfolio Backend is running 🚀",
  });
});

// ==========================================
// API ROUTES
// ==========================================

// Projects
app.use(
  "/api/projects",
  projectRoutes
);

// Skills
app.use(
  "/api/skills",
  skillsRoutes
);

// Experience
app.use(
  "/api/experience",
  experienceRoutes
);

// Education
app.use(
  "/api/education",
  educationRoutes
);

// Certificates
app.use(
  "/api/certificates",
  certificateRoutes
);

// Messages
app.use(
  "/api/messages",
  messageRoutes
);

// Admin Authentication
app.use(
  "/api/auth",
  authRoutes
);

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
  (error, req, res, next) => {
    console.error(
      "Server Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal server error",
    });
  }
);

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, async () => {
  console.log("--------------------------------");
  console.log(
    "Portfolio Backend Started 🚀"
  );
  console.log(
    `Server: http://localhost:${PORT}`
  );
  console.log("--------------------------------");

  // ========================================
  // CHECK MYSQL
  // ========================================

  try {
    await pool.query("SELECT 1");

    console.log(
      "✅ MySQL database connected successfully!"
    );
  } catch (error) {
    console.error(
      "❌ MySQL database connection failed:",
      error.message
    );
  }

  // ========================================
  // CHECK EMAIL
  // ========================================

  await verifyMailer();
});