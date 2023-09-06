import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      
      user: "eddie.rawat@gmail.com",
      pass: "@Poonam99",
    },
  });

  export default transporter 