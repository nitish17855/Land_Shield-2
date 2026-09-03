require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const nodemailer = require("nodemailer");

const cadastralRoutes = require("./src/routes/cadastralRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log("Server cannot send emails yet. Check .env config.", error?.message || error);
  } else {
    console.log("Server is ready to send emails");
  }
});

// Contact API Endpoint
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "nitishtripathi54@gmail.com",
      subject: `New Contact Request from ${name}`,
      text: `
You have a new contact request from LandShield Landing Page:

Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}

Message:
${message || "N/A"}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Mount Cadastral / Land Record routes
app.use("/api/cadastral", cadastralRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "HEALTHY", service: "LandShield Backend API", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`LandShield Backend running on http://localhost:${PORT}`);
  console.log(`Cadastral API: http://localhost:${PORT}/api/cadastral`);
  console.log(`Contact API:   http://localhost:${PORT}/api/contact`);
  console.log(`===================================================`);
});
