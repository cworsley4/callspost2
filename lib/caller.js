var twilio = require('twilio');

const twilioAccountId = process.env.TWILIO_ACCOUNT_ID;
const twilioTokenId = process.env.TWILIO_TOKEN_ID;

var debug = require('debug')('app:worker');
var client = twilio(twilioAccountId, twilioTokenId);

function noop () {
  // noop
}

class Worker {
  
  constructor () {
    this.calls = {};
    this.timer(); 
  }
  
  addCall (to, callId, callback) {
    this.calls[to] = {
      status: 'Initializing',
      callId: callId,
      startTime: new Date().getTime(),
      removalAttemptsLeft: 3,
      callback: callback || noop
    }
  }
  
  create (to, from, url, callback) {
    if (!to) {
      return;
    }

    callback = callback || noop;
    from = from || '';
    
    client.calls.create({
      to: to,
      from: '+16502354600', 
      url: `${process.env.DOMAIN}/call/instructions`,
      method: 'POST',
      record: 'true'
    });
  }
  
  timer () {
    const timeout = 1000;

    // End call after 1 minuite
    setTimeout(() => {
      var calls = this.calls;
      var now = new Date().getTime();
      var callKeys = Object.keys(calls);

      for (var i = 0; i < callKeys.length; i++) {
        var call = calls[callKeys[i]];
        
        debug('Checking for calls to end.', now - call.startTime);
        
        if ((now - call.startTime > timeout * 25) && (call.removalAttemptsLeft > 0)) {
          debug('Reaping call: ' + call.callId);
          // End call
          client
            .calls(call.callId)
            .update({
              status: 'completed'
            }, (err, call) => {
              debug(err, call);
              var callTo = call.to.replace('+1', '');
              if (!err) {
                debug('Trying to delete call ', callKeys[i], this.calls[callTo]);
                
                this.calls[callTo].callback.apply(arguments);
                delete this.calls[callTo];
                return;
              }
    
              this.calls[callTo].removalAttemptsLeft--;
          });
        }
      }

      this.timer();
    }, timeout);
  }
}

// Singleton
module.exports = new Worker();
