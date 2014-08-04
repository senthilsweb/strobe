var _ = require("lodash");
var utility = require('../services/utility');
var mailgunEmailNotification = require('../services/mail-gunEmailNotification');
var _randString = require('random-string');

module.exports = _.merge(_.cloneDeep(require("../services/BaseController")), {

    /*'index': function (req, res) {
    res.view();
    },*/
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

                    //Commented to generate random password to send to employee
                    //Added by Paulomi: to decrypt the passowrd
                    //var decryptedPassword = easycrypto.decrypt(employee.password, sails.config.appsettings.strobePassKey);
                    //employee.password = decryptedPassword;

                    //Generate a random password
                    employee.password = _randString({ length: 10 });
                    var encryptpassword = easycrypto.encrypt(employee.password, sails.config.appsettings.strobePassKey);
                    employee.password = encryptpassword;
                    employee.confirmPassword = encryptpassword;
                    //Update the password and confirmPassword in Employee table into database
                    employee.save(function (err) {
                        if (err) return res.serverError(err);
                    });

                    //Get back the employee by id to send the decrypted password
                    //to send to template decrypt the password and send
                    employee.password = easycrypto.decrypt(employee.password, sails.config.appsettings.strobePassKey);

                    //Pass the path of the template and the data to bind template
                    var args = {};
                    args.tempPath = "./email_templates/forgotpassword.ejs";
                    args.data = employee;
                    //html variable contain the entire text of the template
                    //use the utility helper method to call the template                                       
                    var html = utility.renderHtmlfromTemplate(args);


                    //Pass the email data to mail-gunEmailNotification
                    var emailData = {};
                    //emailData.from = "";
                    emailData.to = params.email;
                    emailData.subject = "Password Reminder";
                    emailData.text = html;
                    // var response = mailgunEmailNotification.sendNotification(emailData);
                    mailgunEmailNotification.sendNotification(emailData)
                    .then(function (responseText) {
                        // If the HTTP response returns 200 OK, log the response text.
                        //console.log(responseText);
                        res.send(200, responseText);
                    }, function (error) {
                        // If there's an error or a non-200 status code, log the error.
                        //console.error(error);
                        res.send(500, error);
                    });
                }
                //console.log("Employee found:", employee.name);
            }
        });
    },

    changePassword: function (req, res) {
        var easycrypto = require('easycrypto').getInstance();
        var response = {};
        response.status = true;
        var params = req.params.all();
        var currentpwd = easycrypto.encrypt(params.currentPassword, sails.config.appsettings.strobePassKey)
        Employee.findOne({ id: req.session.employee.id, password: currentpwd }, function (err, employee) {
            if (err) {
                return console.log(err);
                response.err = err;
                response.status = false;
                response.message = "Error in finding Employee";
            }
            else {
                if (employee === undefined) {
                    response.status = false;
                    response.message = "Employee not found....!!!!";
                    res.send(500, response);
                } else {
                    employee.password = easycrypto.encrypt(params.newPassword, sails.config.appsettings.strobePassKey);
                    employee.confirmPassword = easycrypto.encrypt(params.newPassword, sails.config.appsettings.strobePassKey);
                    //save the updated value
                    employee.save(function (err) {
                        if (err) return res.serverError(err);
                    });
                    delete employee.password;
                    delete employee.confirmPassword;
                    req.session.employee = employee;
                    response.status = true;
                    response.message = "Password changed successfully";
                    res.send(200, response);
                }

            }
        });
    },

    /*employeeExist: function (req, res) {
    var params = req.params.all();
    var response = {};
    Employee.findOne({ email: params.email }, function (err, employee) {
    if (err) {
    response.err = err;
    response.status = false;
    response.message = "Something went wrong";
    } else {
    if (employee === undefined) {
    response.status = false;
    response.message = "Email does not exist";
    res.send(response)
    }
    else {
    response.status = true;
    response.message = "Email already exist";
    res.send(response)
    }
    }
    });

    },*/
    /**
    * Overrides for the settings in `config/controllers.js`
    * (specific to CasestudyController)
    */
    _config: {
        /*blueprints: {
        actions: true,
        rest: true,
        shortcuts: true
        }*/
    }


});
