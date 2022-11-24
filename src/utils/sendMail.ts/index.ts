import nodemailer from "nodemailer";
import config from "@config/env/config";
import SMTPTransport from "nodemailer/lib/smtp-transport";

interface MailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendMail = async (options: MailOptions) => {
  const transporter = nodemailer.createTransport({
    host: config.SMPT_HOST,
    port: config.SMPT_PORT,
    service: config.SMPT_SERVICE,
    auth: {
      user: config.SMPT_MAIL,
      pass: config.SMPT_PASSWORD,
    },
  } as SMTPTransport.Options);

  const mailOptions = {
    from: config.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log(err);
      console.log("Error Occurs");
    } else {
      console.log("Email Sent Successfully");
    }
  });
};
