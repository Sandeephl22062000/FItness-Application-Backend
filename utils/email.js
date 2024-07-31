const nodemailer = require("nodemailer");

// 1 create a options
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "sandeepnode001@gmail.com",
      pass: "ysbxtfhrmwsvcxbu",
    },
  });

  const mailoptions = {
    from: options.sender,
    to: options.receiver,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailoptions);
};

module.exports = sendEmail;
