const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const mailSender = async (email, title, dynamicData) => {
  try {
    const templatePath = path.join(__dirname, "emailTemplate.html");
    if (!fs.existsSync(templatePath)) {
      console.error("❌ Template file not found at:", templatePath);
      throw new Error("Template file not found");
    }
    let htmlContent = fs.readFileSync(templatePath, "utf8");

    htmlContent = htmlContent
      .replace(/{{name}}/g, dynamicData.name || "User")
      .replace(/{{message}}/g, dynamicData.message || "")
      .replace(/{{year}}/g, new Date().getFullYear());

    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: `Ranknest <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: htmlContent,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};

module.exports = mailSender;
