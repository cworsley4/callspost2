
var twilioAccountId = 'AC43396415fe81f282daa22dbbf897d2bc';
var twilioTokenId = '7a61b68c4ab74dea2b7f2fa2ed40bbcb';

var twilio = require('twilio');

var debug = require('debug')('app:worker');
var client = twilio(twilioAccountId, twilioTokenId);

function noop() {}

function addCall (to, callId) {
  this.calls[to] = {
    status: 'Initializing',
    callId: callId,
    startTime: new Date().getTime(),
    removalAttemptsLeft: 3 
  }
}

function Worker() {
  this.calls = {};
  this.timer();
}

Worker.prototype.create = function (to, from, url, callback) {
  var self = this;
  if (!to) {
    return;
  }

  callback = callback || noop;
  from = from || '';
  client.calls.create({
    to: to,
    from: "+16502354600", 
    url: "http://08d2e07d.ngrok.io/call/instructions", 
    method: "POST",
    record: "true"
  }, function(err, call) {
    if (!err) {
      // Add to timer
      addCall.apply(self, [to, call.sid]);
      return;
    }

    debug(err);

    callback.apply(arguments);
  });
}

Worker.prototype.timer = function () {
  var self = this;
  var timeout = 1000;

  // End call after 1 minuite
  setTimeout(function () {
    var calls = self.calls;
    var now = new Date().getTime();
    var callKeys = Object.keys(calls);

    for (var i = 0; i < callKeys.length; i++) {
      call = calls[callKeys[i]];
      
      debug('Checking for calls to end.', now - call.startTime);
      
      if (now - call.startTime > timeout * 25) {
        debug('Reaping call: ' + call.callId);
        // End call
        client.calls(call.callId).update({
          status: 'completed'
        }, function(err, call) {
          console.log(arguments);
          if (!err) {
            debug('Trying to delete call ', callKeys[i], self.calls[call.to]);
            delete self.calls[call.to];
            return;
          }

          self.calls[to].removalAttemptsLeft--;
        });
      }
    }

    self.timer();
  }, timeout);
}

// Singleton
module.exports = new Worker();
