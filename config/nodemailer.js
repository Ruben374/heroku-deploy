const nodemailer = require('nodemailer')
const config = require('../config/auth')

const user = config.user
const pass = config.pass

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: user,
    pass: pass
  }
})

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  transport
    .sendMail({
      from: user,
      to: email,
      subject: `${confirmationCode} is your Agendei verification code`,
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing. Please enter this verification code</p>
         <P>${confirmationCode}</P>
          </div>`
    })
    .catch(err => console.log(err))
}
