
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/**
 * Nodemailer
 */

exports = module.exports = function bodyParser(options){
  var _urlencoded = urlencoded(options)
    , _multipart = multipart(options)
    , _json = json(options);

  return function bodyParser(req, res, next) {
    _json(req, res, function(err){
      if (err) return next(err);
      _urlencoded(req, res, function(err){
        if (err) return next(err);
        _multipart(req, res, next);
      });
    });
  }
};

 var nodemailer = require('nodemailer');

 app.post('/index', function (req, res) {
  var mailOpts, smtpTrans;

  smtpTrans = nodemailer.createTransport('SMTP', {
      service: 'Gmail',
      auth: {
          user: "user@gmail.com",
          pass: "password"
      }
  });

  mailOpts = {
      from: req.body.name + ' &lt;' + req.body.email + '&gt;', //grab form data from the request body object
      to: 'joaosteing@gmail.com, guilherme@rotadosconcursos.com.br',
      subject: 'Website contact form',
      text: req.body.name + '\n' + req.body.email
  };

  smtpTrans.sendMail(mailOpts, function (error, response) {
      //Email not sent
      if (error) {
          res.render('index', { title: 'Landing page example', msg: 'Error occured, message not sent.', err: true })
      }
      //Yay!! Email sent
      else {
          res.render('index', { title: 'Landing page example', msg: 'Message sent! Thank you.', err: false })
      }
  });
});