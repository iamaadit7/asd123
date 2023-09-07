import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      
      user: process.env.EMAIL_HOST,
      pass: process.env.EMAIL_PORT,


    },
  });

  export default transporter