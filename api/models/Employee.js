
/**
 * Department
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
 var _randString = require('random-string');
 var easycrypto = require('easycrypto').getInstance();
 module.exports = {

     attributes: {

         toJSON: function () {
             // this gives you an object with the current values
             var obj = this.toObject();
             delete obj.password;
             delete obj.confirmPassword;
             return obj;
         }

     },
     beforeCreate: function (values, next) {
     console.log("value = " + values.code); 
     var randomString = require('random-string');
     values.code = randomString({ length: 6 })        
     next();
     }
     /*beforeCreate: function (obj, cb) {
         
         var encryptedPassword = easycrypto.encrypt(obj.password, 'mypassword'); //"mypassword" -> is the password to be given during decryption
         obj.password = encryptedPassword
         obj.confirmPassword = encryptedPassword
         console.log("Employee before create")
         obj.code = _randString({ length: 6 });
         console.log(obj + "" + obj.code + " ," + obj.password);
         //next();
         return cb(null, obj);
     }*/
 };

