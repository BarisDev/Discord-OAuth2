var PORT = process.env.PORT || 50451;
const express = require('express');
const path = require('path');
const app = express();
var data = require('./api/data');

app.use('/api/discord', require('./api/discord'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/guildCalendar', function(req, res) {
  res.render('pages/guildCalendar', { 
    Username: data.sendUsername(), 
    Guildname: data.sendGuildname(),
    Image: data.sendImage(),
    Language: data.sendLanguage(),
 
  });
});

app.listen(PORT, () => {
  console.info('Running on port 50451');
});

app.use((err, req, res, next) => {
  switch (err.message) {
    case 'NoCodeProvided':
      return res.status(400).send({
        status: 'ERROR',
        error: err.message,
      });
    default:
      return res.status(500).send({
        status: 'ERROR',
        error: err.message,
      });
  }
});