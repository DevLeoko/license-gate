import { createTransport } from "nodemailer";
import fs from "fs";

const mailer = createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

type MailTemplateName = "verify-email" | "reset-password";

export async function sendMail(
  email: string,
  subject: string,
  templateName: MailTemplateName,
  templateVariables: { [key: string]: string }
) {
  const mailTemplate = fs.readFileSync(
    `src/assets/mail/${templateName}.html`,
    "utf8"
  );
  const mailBody = Object.keys(templateVariables).reduce((acc, key) => {
    return acc.replace(
      new RegExp(`{{${key.toUpperCase()}}}`, "g"),
      templateVariables[key]
    );
  }, mailTemplate);

  return new Promise((resolve, reject) => {
    mailer.sendMail(
      {
        from: process.env.SMTP_SENDER,
        to: email,
        subject: subject,
        html: mailBody,
      },
      (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      }
    );
  });
}
