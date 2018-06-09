var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  tls: true,
  auth: {
    user: 'infracloud@sysmap.com.br',
    pass: 'Brasil2018'
  }
});

var mailOptions = {
  from: 'infracloud@sysmap.com.br',
  to: 'flavio.carmo@sysmap.com.br',
  subject: '',
  text: ''
};

/* POST comments listing. */
router.post('/', function(req, res, next) {
  var data = {};
  data = req.body;

  console.log('JSON: ' + JSON.stringify(data));

  mailOptions.subject = 'RESPOSTA NÃO ENCONTRADA PELO USUÁRIO';
  mailOptions.text = JSON.stringify(data);

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });

  res.status(200).json(data);
});

module.exports = router;