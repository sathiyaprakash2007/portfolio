const { pool } = require("../config/db");

const {
  transporter,
} = require("../config/mailer");

// ==========================================
// EMAIL VALIDATION
// ==========================================

const isValidEmail = (email) => {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

// ==========================================
// GET ALL MESSAGES
// GET /api/messages
// ==========================================

const getMessages = async (req, res) => {
  try {
    const [messages] = await pool.query(
      "SELECT * FROM messages ORDER BY created_at DESC"
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });

  } catch (error) {
    console.error(
      "Error fetching messages:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

// ==========================================
// CREATE MESSAGE
// POST /api/messages
// ==========================================

const createMessage = async (req, res) => {
  try {
    let {
      name,
      email,
      subject,
      message,
    } = req.body;

    // ==========================================
    // REMOVE EXTRA SPACES
    // ==========================================

    name = name?.trim();
    email = email?.trim();
    subject = subject?.trim() || "";
    message = message?.trim();

    // ==========================================
    // REQUIRED FIELDS
    // ==========================================

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and message are required",
      });
    }

    // ==========================================
    // NAME VALIDATION
    // ==========================================

    if (name.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Name must contain at least 2 characters",
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Name must not exceed 100 characters",
      });
    }

    // ==========================================
    // EMAIL VALIDATION
    // ==========================================

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address",
      });
    }

    if (email.length > 255) {
      return res.status(400).json({
        success: false,
        message:
          "Email address is too long",
      });
    }

    // ==========================================
    // SUBJECT VALIDATION
    // ==========================================

    if (subject.length > 200) {
      return res.status(400).json({
        success: false,
        message:
          "Subject must not exceed 200 characters",
      });
    }

    // ==========================================
    // MESSAGE VALIDATION
    // ==========================================

    if (message.length < 5) {
      return res.status(400).json({
        success: false,
        message:
          "Message must contain at least 5 characters",
      });
    }

    if (message.length > 5000) {
      return res.status(400).json({
        success: false,
        message:
          "Message must not exceed 5000 characters",
      });
    }

    // ==========================================
    // SAVE TO MYSQL
    // ==========================================

    const [result] = await pool.query(
      `INSERT INTO messages
      (name, email, subject, message)
      VALUES (?, ?, ?, ?)`,
      [
        name,
        email,
        subject,
        message,
      ]
    );

    // ==========================================
    // SEND EMAIL
    // ==========================================

    try {
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,

        to: process.env.EMAIL_TO,

        replyTo: email,

        subject:
          `New Portfolio Message: ${
            subject || "No Subject"
          }`,

        text: `
You received a new message from your portfolio.

----------------------------------------
CONTACT DETAILS
----------------------------------------

Name: ${name}
Email: ${email}
Subject: ${subject || "No Subject"}

----------------------------------------
MESSAGE
----------------------------------------

${message}

----------------------------------------
Message ID: ${result.insertId}
----------------------------------------
        `,

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: auto;
            padding: 20px;
          ">

            <h2 style="
              color: #0891b2;
              margin-bottom: 20px;
            ">
              📩 New Portfolio Message
            </h2>

            <p>
              You received a new message from your portfolio.
            </p>

            <hr />

            <h3>Contact Details</h3>

            <p>
              <strong>Name:</strong>
              ${name}
            </p>

            <p>
              <strong>Email:</strong>
              ${email}
            </p>

            <p>
              <strong>Subject:</strong>
              ${subject || "No Subject"}
            </p>

            <hr />

            <h3>Message</h3>

            <div style="
              background: #f4f4f4;
              padding: 15px;
              border-radius: 8px;
              white-space: pre-wrap;
            ">
              ${message}
            </div>

            <hr />

            <p style="
              color: #777;
              font-size: 13px;
            ">
              Message ID: ${result.insertId}
            </p>

          </div>
        `,
      });

      console.log(
        "✅ Email notification sent successfully!"
      );

    } catch (emailError) {
      console.error(
        "❌ Email notification failed:",
        emailError.message
      );

      // Message is already saved in MySQL,
      // so don't fail the visitor's request.
    }

    // ==========================================
    // SUCCESS
    // ==========================================

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      messageId: result.insertId,
    });

  } catch (error) {

    console.error(
      "Error creating message:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

// ==========================================
// DELETE MESSAGE
// DELETE /api/messages/:id
// ADMIN ONLY
// ==========================================

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM messages WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Message deleted successfully",
    });

  } catch (error) {

    console.error(
      "Error deleting message:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete message",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getMessages,
  createMessage,
  deleteMessage,
};