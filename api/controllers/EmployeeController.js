var _ = require("lodash");
module.exports = _.merge(_.cloneDeep(require("../services/BaseController")), {

    'index': function (req, res) {
        res.view();
    },
    forgotPassword: function (req, res) {
        var response = {};
        response.status = true;
        response.err = null;
        //decrypt the password and then check
        var easycrypto = require('easycrypto').getInstance();
        var params = req.params.all();
        console.log("email is :" + params.email);
        Employee.findOne({ email: params.email }, function (err, employee) {
            if (err) {
                return console.log(err);
                response.err = err;
                response.status = false;
                response.message = "Something went wrong";
                // The User was found successfully!
            } else {
                if (employee === undefined) {
                    response.status = false;
                    response.message = "The email [" + params.email + "] does not exists!!!!";
                    res.send(500, response)
                } else {
                    //Added by Paulomi: to decrypt the passowrd
                    var decryptedPassword = easycrypto.decrypt(employee.password, 'mypassword');
                    employee.password = decryptedPassword;

                    /*Send Email (start)*/
                    var ejs = require('ejs');
                    var fs = require("fs");                  
                    var tmpl = fs.readFileSync("./email_templates/forgotpassword.ejs", "utf-8");
                    //console.log("ejs = " + ejs);
                    var html = ejs.render(tmpl,employee);                    
                    var Mailgun = require('mailgun-js');
                    var api_key = sails.config.appsettings.mailgun.api_key;
                    var domain = sails.config.appsettings.mailgun.domain;
                    var from = sails.config.appsettings.mailgun.from;
                    //Instantiate Mailgun
                    var mailgun = new Mailgun({ apiKey: api_key, domain: domain });

                    //Create Mail Message
                    var data = {
                        from: from,
                        to: params.email,
                        subject: "Password Reminder",
                        text: html
                    };
                    //Send Mail Message
                    try {
                        mailgun.messages().send(data, function (error, body) {
                            if (error !== undefined) {
                                response.err = error;
                                response.status = false;
                                response.message = error;
                                res.send(500, response)
                            } else {
                                response.message = 'The password has been sent to your email registered with us!!!';
                                res.send(200, response)
                            }
                        });
                    }
                    catch (e) {
                        res.send('Exception while sending mail...');
                        console.log("Exception: " + e.message);
                    }

                    /*Send Email (end)*/
                }
                //console.log("Employee found:", employee.name);
            }
        });
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
