import nodemailer from "nodemailer";
import "dotenv/config.js";

const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

// transport
//   .sendMail(email)
//   .then(() => console.log("Email send success"))
//   .catch((error) => console.log(error.message));

const sendEmail = (data) => {
  const email = { ...data, from: UKR_NET_EMAIL };
  return transport.sendMail(email);
};

export default sendEmail;
