/**
 * AuthController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    login: function (req, res) {
        var params = req.params.all();
        //encrypt the password and then check
        var easycrypto = require('easycrypto').getInstance();
        //TODO : keep the encryption & decryption in common helper class & then bring the crypto password from confg file
        var encryptedPassword = easycrypto.encrypt(params.password, 'mypassword');  //"mypassword" -> is the password to be given during decryption
        //Paulomi: added console to check values
        console.log("email is :" + params.email + " password is :" + encryptedPassword);
        Employee.findOne({ email: params.email, password: encryptedPassword }, function (err, employee) {
            if (err) {
                return console.log(err);
                // The User was found successfully!
            } else {
                if (employee === undefined) {
                    res.send(500, "Authentication Failed....")
                } else {
                    delete employee.password;
                    delete employee.confirmPassword;                    
                    req.session.authenticated = true;
                    req.session.employee = employee;
                    //console.log("check session :" + req.session.authenticated );
                    res.send(200, employee);
                }
                //console.log("Employee found:", employee.name);
            }
        });
    },
    logout: function (req, res) {
        var params = req.params.all();
        req.session.authenticated = false;
        //wipe out the session (log out)
        req.session.destroy()
        //req.logout();
        res.send(200, 'logout successful');
    }

}