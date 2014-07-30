
/**
 * Department
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
 //var _randString = require('random-string');
 //var easycrypto = require('easycrypto').getInstance();
module.exports = {

    attributes: {
      
    },
    beforeCreate: function (values, next) {
        var randomString = require('random-string');
        values.code = randomString({ length: 6 });
        console.log("value = " + values.code);
        //Added by Paulomi: start
        var easycrypto = require('easycrypto').getInstance();
        var encryptedPassword = easycrypto.encrypt(values.password, sails.config.appsettings.strobePassKey); 
        values.password = encryptedPassword;
        values.confirmPassword = encryptedPassword;
        console.log("password = " + values.password);
        //Added by Paulomi: stop
        next(); //Added by Paulomi: In your Employee model, you need to use the next() method. This method passes control back to the next piece of middleware on the stack. Without it, it blocks execution.
    }
    /*beforeCreate: function (obj, cb) {
         
    var encryptedPassword = easycrypto.encrypt(obj.password, sails.config.appsettings.strobePassKey); 
    obj.password = encryptedPassword
    obj.confirmPassword = encryptedPassword
    console.log("Employee before create")
    obj.code = _randString({ length: 6 });
    console.log(obj + "" + obj.code + " ," + obj.password);
    //next();
    return cb(null, obj);
    }*/
};

