var Q = require("q");
module.exports = {
    sendNotification: function (emailData) {
        var response = {}; 
        var from = sails.config.appsettings.mailgun.from;        
        //Create Mail Message
        var data = {
            from: from,
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.text
        };
        //Send Mail Message
        try {
     /*Send Email (start)*/
        var Mailgun = require('mailgun-js');
        var api_key = sails.config.appsettings.mailgun.api_key;
        var domain = sails.config.appsettings.mailgun.domain;
        
     
        //Instantiate Mailgun
        var mailgun = new Mailgun({ apiKey: api_key, domain: domain });
        var deferred = Q.defer();

      //Send Mail Message
            var promise = (mailgun.messages().send(data, mailguncallback));
             function mailguncallback(error, body) {            
                 var response = {};
                 if (error !== undefined) {
                     response.err = error;
                     response.status = false;
                     response.message = error;
                     deferred.reject(response);
                 } else {
                     response.status = true;
                     response.message = 'The password has been sent to your email registered with us!!!';
                     deferred.resolve(response);                     
                 }
             }
             return deferred.promise;
        }
        catch (e) {
            //res.send('Exception while sending mail...');
            console.log("Exception: " + e.message);
        }
        /*Send Email (end)*/
    }
}
