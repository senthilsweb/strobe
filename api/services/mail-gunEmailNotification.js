module.exports = {
    sendNotification: function (emailData) {       
        var response = {};
        /*Send Email (start)*/
        var Mailgun = require('mailgun-js');
        var api_key = sails.config.appsettings.mailgun.api_key;
        var domain = sails.config.appsettings.mailgun.domain;
        var from = sails.config.appsettings.mailgun.from;
        //Instantiate Mailgun
        var mailgun = new Mailgun({ apiKey: api_key, domain: domain });

        //Create Mail Message
        var data = {
            from: from,
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.text
        };
        //Send Mail Message
        try {
            mailgun.messages().send(data, function (error, body) {
                if (error !== undefined) {  
                    response.err = error;
                    response.status = false;
                    response.message = error;
                    return response;
                    //res.send(500, response)
                } else {  
                    response.message = 'The password has been sent to your email registered with us!!!';
                   return response;
                    //res.send(200, response)
                }
            });
        }
        catch (e) {  
            res.send('Exception while sending mail...');
            console.log("Exception: " + e.message);
        }
       
        /*Send Email (end)*/
    }
}