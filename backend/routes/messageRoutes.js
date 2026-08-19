const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  getMessages,
  createMessage,
  deleteMessage,
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// CONTACT FORM RATE LIMIT
// ==========================================

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  // Maximum 5 contact submissions
  // from one IP within 15 minutes
  max: 5,

  message: {
    success: false,
    message:
      "Too many messages sent. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

// ==========================================
// GET ALL MESSAGES
// GET /api/messages
// PUBLIC
// ==========================================

router.get(
  "/",
  getMessages
);

// ==========================================
// CREATE MESSAGE
// POST /api/messages
// PUBLIC + RATE LIMITED
// ==========================================

router.post(
  "/",
  contactLimiter,
  createMessage
);

// ==========================================
// DELETE MESSAGE
// DELETE /api/messages/:id
// ADMIN ONLY 🔐
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteMessage
);

// ==========================================
// EXPORT
// ==========================================

module.exports = router;