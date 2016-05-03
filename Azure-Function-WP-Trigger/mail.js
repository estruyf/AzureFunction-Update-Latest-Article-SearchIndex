var mail = (function () {
    var send = function (subject, body) {
        var sendgrid = require("sendgrid")(global.settings.sendgridKey);
        
        var payload   = {
            to: global.settings.mailTo,
            from: global.settings.mailFrom,
            subject: subject,
            text: body
        };
        
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