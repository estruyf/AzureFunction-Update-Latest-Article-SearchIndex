var configuration = require('./config'),
    config = configuration.get();
    sendgrid = require("sendgrid")(config.sendgridKey);
    
var mail = (function () {
    var payload   = {
        to: config.mailTo,
        from: config.mailFrom,
        subject: '',
        text: ''
    };

    var send = function (subject, body) {
        payload.subject = subject;
        payload.html = body;
        
        var email = new sendgrid.Email();
        sendgrid.send(payload, function(error, json) {
            if (error) { 
                // An mail error occurred
            }
        });
    };
    
    return {
        send: send
    }
})();

module.exports = mail;