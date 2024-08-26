import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function sendEmail({ to, subject, body }: { to: string, subject: string, body: string }) {
  try {
    await transporter.sendMail({
      from: process.env.SENDING_EMAIL,
      to,
      subject,
      text: body
    })
  } catch (error) {
    console.error('Error sending email:', error)
  }
}
