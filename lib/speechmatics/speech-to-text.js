
var fs = require('fs');
var rest = require('restler');
var Speech = require('../speech');

var debug = require('debug')('app:speech');
var noop = function () {};

class Speechmatics extends Speech {
  constructor () {
    super();
    this.userId = process.env['SPEECHMATICS_USER_ID'];
    this.apiRoot = process.env['SPEECHMATICS_API_URL'];
    this.apiKey = process.env['SPEECHMATICS_API_KEY'];
    this.apiUrl = `${this.apiRoot}/user/${this.userId}/jobs/?auth_token=${this.apiKey}'`;
  };

  createJob (path, callback) {
    callback = callback || noop;

    debug(fs.readFileSync(path));

    rest.post(this.apiUrl, {
      multipart: true,
      data: {
        'model': 'en-US',
        'data_file': rest.file(path, null, 321567, null, 'audio/mpeg')
      }
    }).on('complete', (data) => {
      debug(data);
    });
  };
}

module.exports = Speechmatics;
