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
  to: 'sistemas@sysmap.com.br',
  bcc: 'flavio.carmo@sysmap.com.br;gustavo.teixeira@sysmap.com.br',
  subject: '',
  html: ''
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
});

router.delete('/', function (request, response) {
  global.db.deleteAll((error, result) => {
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
    } else {

      if(data.queryResult.intent.displayName == 'Perguntas_aleatórias'){
        
        var p = {};
        p.refSession = refTokenSession;

        global.db.findAllComments(p, (error, rComments) => {
          if (error) {
              return console.log(error);
          } else {

            var userName = '';

            try{
              rComments.forEach(function(c){
                if(c.queryResult.outputContexts){
                  if(c.queryResult.outputContexts.length){
                    c.queryResult.outputContexts.forEach(function(p){
                      if(p.parameters.userName){
                        userName = p.parameters.userName;
                      }
                    })
                  }
                }
            });
            }catch(e){

            }

            var tr = '';

            if(userName){
              tr = '<span>Olá!<br />O usuário <b>' + userName + '</b> não conseguiu encontrar uma solução de sua dúvida.</span><p><p>';
            } else {
              tr = '<span>Olá!<br />O usuário não conseguiu encontrar uma solução de sua dúvida.</span><p><p>';
            }

            rComments.forEach(function(c){
              tr = tr + '<span>Usuário: ' + c.queryResult.queryText + '</span><br/>'
              tr = tr + '<span>Sammy: ' + c.queryResult.fulfillmentText + '</span><p>'
            });

            tr = tr + '<br>Att, <br />Sistemas'

            mailOptions.subject = 'NOTIFICAÇÃO - SAMMY';
            mailOptions.html = tr;

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  return console.log('ERRO AO ENVIAR EMAIL: ' + error); 
              } else {
                console.log('MENSAGEM DE TESTE: %s', info.messageId);
                console.log('INFO TESTE EMAIL: %s', nodemailer.getTestMessageUrl(info));
              }
            });

            res.status(200).json(rComments);
          }
        });
        //res.status(200).json(rComments);
        
      } else {
        res.status(201).json(data);
      }
    }
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