/* global process */
var fs = require('fs');
var co = require('co');
var https = require('https');
var app = require('express')();
var bodyParser = require('body-parser');
var debug = require('debug')('app:main');

var Caller = require('./lib/caller');
var Watson = require('./lib/watson/speech-to-text');
var SpeechMatics = require('./lib/speechmatics/speech-to-text');

var watson = new Watson()

// TODO: Make module
var responses = {};
var files = fs.readdirSync('./responses');
for (var i in files) {
  var file = files[i];
  responses[file] = fs.readFileSync('./responses/' + file).toString();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  type: 'application/x-www-form-urlencoded'
}));

// TODO: Move this out in to API routes
app.get('/status', (req, res) => {
  res.json({
    calls: Caller.calls
  });
});

app.post('/call/status', (req, res) => {
  debug(req.body);
  res.send('OK');
});

app.post('/call/recording', (req, res) => {
  var recording = fs.createWriteStream('./tmp/recordings/' + new Date().getTime() + '.wav');
  
  debug('About to get call recording', req.body['RecordingUrl']);
  
  https.get(req.body['RecordingUrl'], (res) => {
    res.on('data', (data) => {
      recording.write(data);
    }).on('end', () => {
      recording.end();
      
      debug(recording, recording.path);
      
      watson.createJob(recording.path, (err, res) => {
        debug(arguments);
      });

      debug('File downloaded');
      debug(recording);
    });
  });

  res.send('Ok');
});

app.post('/call/instructions', (req, res) => {
  debug(req.body, req.query);
  Caller.addCall(req.query['To'], req.body['CallSid']);
  
  res.set('Content-Type', 'text/xml');
  res.send(responses['recording.xml']);
});

app.post('/call/create', (req, res) => {
  Caller.create(req.body.to, null, null, (err, res) => {
    res.json({
      error: false,
      body: arguments
    });
  });
});

app.listen(process.env.PORT || 3005, () => {
  debug('Server is serving on port ', process.env.PORT || 3005);
});
