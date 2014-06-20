var _ = require("lodash");
module.exports = _.merge(_.cloneDeep(require("../services/BaseController")), {

    'index': function (req, res) {
        res.view();

    },

    sendNotification: function (req, res) {
        var params = req.params.all();
        var Mailgun = require('mailgun-js');
        var api_key = 'key-6d9ato2pcav6w376dp5ad0ozpbxu0sx9';
        var domain = 'sandbox45333.mailgun.org';
        var from = 'vmokshalab@gmail.com';
        //Instantiate Mailgun
        var mailgun = new Mailgun({ apiKey: api_key, domain: domain });

        //Create Mail Message
        var data = {
            from: from,
            to: params.email,
            subject: params.subject,
            text: params.body
        };
        //Send Mail Message
        try {
            mailgun.messages().send(data, function (error, body) {
                if (error !== undefined) {
                    res.send('Exception while sending mail...' + error.message);
                } else {
                    res.send('Mail Send Successfully...');
                    console.log(body);
                }
            });
        }
        catch (e) {
            res.send('Exception while sending mail...');
            console.log("Exception: " + e.message);
        }
    },

    /**
    * Overrides for the settings in `config/controllers.js`
    * (specific to CasestudyController)
    */
    _config: {
        blueprints: {
            actions: true,
            rest: true,
            shortcuts: true
        }
    }


});
