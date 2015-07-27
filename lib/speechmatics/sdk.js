
var fs = require('fs');
var rest = require('restler');
var superagent = require('superagent');
var debug = require('debug')('app:speech');
var noop = function () {};

function Speech () {
  this.userId = 1343;
  this.apiRoot = 'https://api.speechmatics.com/v1.0';
  this.apiKey = 'YjZkODk0MWItMWQzNC00Y2E3LThlMDUtNmFlOWFjZDllMmVh';
}

Speech.prototype.createJob = function (path, callback) {
  callback = callback || noop;

  var url = this.apiRoot + '/user/' + this.userId + '/jobs/?auth_token=YjZkODk0MWItMWQzNC00Y2E3LThlMDUtNmFlOWFjZDllMmVh';

  debug(fs.readFileSync(path));

  rest.post(url, {
    multipart: true,
    data: {
      'model': 'en-US',
      'data_file': rest.file(path, null, 321567, null, 'audio/mpeg')
    }
  }).on('complete', function(data) {
    console.log(data);
  });
};

module.exports = Speech;
