import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendTokenEmail = async (to, stallName, tokenNumber) => {
  try {
    const info = await transporter.sendMail({
      from: `"${stallName} Token Desk" <${process.env.SMTP_USER}>`,
      to,
      subject: `Your Token #${tokenNumber} for ${stallName}`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:10px">
          <h2>🎟️ ${stallName}</h2>
          <p>Dear visitor,</p>
          <p>Your booking has been confirmed.</p>
          <h3>Your Token Number: <strong>#${tokenNumber}</strong></h3>
          <p>Thank you for visiting the ${stallName} stall. Please wait until your number is called.</p>
          <hr/>
          <small>Fest Management System</small>
        </div>
      `,
    });

    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Email error:", error.message);
  }
};
