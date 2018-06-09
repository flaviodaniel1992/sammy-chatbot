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

router.get('/', function(req, res, next){
  var query = req.query;
  var params = {};

  if(query.age){
    params.age = Number(query.age);
  }

  if(query.userName){
    params.userName = query.userName;
  }

  global.db.findAllComments(params, (error, books) => {
    if (error) {
        return console.log(error);
    }
    res.status(200).json(books);
  });
});

router.delete('/:id', function (request, response) {
  var id = request.params.id;

  global.db.deleteComments(id, (error, result) => {
      if(error){
          return console.log(error);
      }
      response.status(204).json({});
  })
})

/* POST comments listing. */
router.post('/', function(req, res, next) {
  var data = {};
  data = req.body;

  var session = data.session;
  var sessionArray = session.split('/');
  var refTokenSession = sessionArray[4];

  if(refTokenSession){
    data.refSession = refTokenSession;
  }

  global.db.insertComments(data, (error, result) => {
    if (error) {
        return console.log(error);
    }
    res.status(201).json(data);
  });

  /*
  mailOptions.subject = 'RESPOSTA NÃO ENCONTRADA PELO USUÁRIO';
  mailOptions.text = JSON.stringify(data);

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log('ERRO AO ENVIAR EMAIL: ' + error); 
      } else {
        console.log('MENSAGEM DE TESTE: %s', info.messageId);
        console.log('INFO TESTE EMAIL: %s', nodemailer.getTestMessageUrl(info));
      }
  });
  res.status(200).json(data);
  */
});

module.exports = router;