import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'

export const domain = 'https://recipesrs.vercel.app/'

dotenv.config({ path: './config/.env' })
const envr = process.env

export const secret = envr.SECRET

export const serverConfig = {
  serverPort: envr.SERVER_PORT,
  dbURL: envr.DB_URL,
}

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: envr.USER_MAIL,
    pass: envr.USER_CODE,
  },
})
export const mailConfig = (recipient, resetLink) => {
  const mail_configs = {
    from: envr.USER_MAIL,
    to: recipient,
    subject: 'No-reply pasword forget',
    html: `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>Pasword recovery procedure</title>
  
</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Recipes.</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Use the following link to complete your Password Recovery Procedure. Link is valid for 10 minutes</p>
    <h2 style="display:flex; width:50%; margin: 0 auto;padding: 0 10px;color: #fff;border-radius: 4px;">${resetLink}</h2>
    <p style="font-size:0.9em;">Regards,<br />RS</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p></p>
      <p></p>
      <p></p>
    </div>
  </div>
</div>
<!-- partial -->
  
</body>
</html>`,
  }
  return mail_configs
}
