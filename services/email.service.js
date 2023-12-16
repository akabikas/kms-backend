const nodemailer = require("nodemailer");

const email = "bikaschetri001@gmail.com";
const pass = "ugdqjdsyajzwfbnr";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: email, pass },
});

const sendEmail = async (emailData) => {
  await transporter.sendMail({
    from: email,
    to: emailData.toEmail,
    subject: emailData.subject,
    text: emailData.text,
    html: emailData.html,
  });
};

module.exports = { sendEmail };
