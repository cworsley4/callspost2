var fs = require('fs');
var Speech = require('../speech');
var request = require('superagent');
var watson = require('watson-developer-cloud');

var debug = require('debug')('app:speech');

class WatsonSpeech extends Speech {
  constructor () {
    super();
    this.speechToText = watson.speech_to_text({
      username: process.env['WATSON_USERNAME'],
      password: process.env['WATSON_PASSWORD'],
      version: process.env['WATSON_API_VERSION']
    });   
  }
  
  createJob (path, callback) {
    var params = {
      audio: fs.createReadStream(path),
      content_type: 'audio/116; rate=44100'
    };

    this.speechToText.recognize(params, function(err, res) {
      if (err) return;
      debug(err, res);
    });
  }
}

module.exports = WatsonSpeech;
