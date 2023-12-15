const nodemailer = require("nodemailer");

const email = "bikaschetri001@gmail.com";
const pass = "ugdqjdsyajzwfbnr";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: email, pass },
});

const sendEmail = async (emailofUser, passwordofUser) => {
  await transporter.sendMail({
    from: email,
    to: email,
    subject: "H&K - Account created successfully",
    text: "We've created your account please use these credentials to access your account:",
    html: `<p>We've created your account please use these credentials to access your account:</p><br><p>${emailofUser} : ${passwordofUser}</p>`,
  });
};

module.exports = { sendEmail };
