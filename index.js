
var fs = require('fs');
var co = require('co');
var http = require('http');
var app = require('express')();
var bodyParser = require('body-parser');
var debug = require('debug')('app:main');

var Caller = require('./lib/caller');
var SpeechMatics = require('./lib/speechmatics/sdk');

var speechApi = new SpeechMatics();

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

app.get('/status', function (req, res) {
  res.json({
    calls: Caller.calls
  });
});

app.post('/call/status', function (req, res) {
  debug(req.body);
  res.send('OK');
});

app.post('/call/recording', function (req, res) {
  var recording = fs.createWriteStream('./tmp/recordings/' + new Date().getTime() + '.mp3');
  http.get(req.body.RecordingUrl + '.mp3', function (res) {
    res.on('data', function (data) {
      recording.write(data);
    }).on('end', function () {
      recording.end();
      speechApi.createJob(recording.path, function (err, res) {
        debug(arguments);
      });
      debug('File downloaded');
      debug(recording);
    });
  });

  res.send('Ok');
});

app.post('/call/instructions', function (req, res) {
  debug(res.body);
  res.set('Content-Type', 'text/xml');
  res.send(responses['recording.xml']);
});

app.post('/call/create', function (req, res) {
  Caller.create(req.body.to);
  res.json({
    error: false,
    body: req.body
  });
});

app.listen(process.env.PORT || 3005, function () {
  debug('Server is serving on port ', process.env.PORT || 3005);
});
