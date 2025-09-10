import nodemailer from "nodemailer";
import ApplicationError from "../../error-handeler/applicationError.js";

export default class EmailServiceNotification {
  static async sendNotification(name, email, job_name, company_name) {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Appling for the job`,
      html: `<h1>Dear ${name}</h2>
      <p>Thanks for appling to the ${job_name} job at ${company_name}. Our representetiv will contect you shortly.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Mail is send successfuly");
    } catch (err) {
      console.error("Email sending error is: ", err.message);
      throw new ApplicationError(
        "Something is went wrong while sending the notification email",
        500
      );
    }
  }
}
