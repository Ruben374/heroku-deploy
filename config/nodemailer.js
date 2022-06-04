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
      subject: `${confirmationCode} é o seu codigo de confirmação Agendei`,
      html: `<h1>Verificação de Email</h1>
          <h2>Olá ${name}!</h2>
          <p>Por favor degite este condigo de confirmação</p>
         <P>${confirmationCode}</P>
          </div>`
    })
    .catch(err => console.log(err))
}
