/**
 * Department
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {



    },
    beforeCreate: function (values, next) {
         console.log("value = " + values.code);        
        //var easycrypto = require('easycrypto').getInstance();
        //var encrypted = easycrypto.encrypt(values.code, 'plasma'); //plasma - > some random password       
        //console.log("encrypted code for [ "  + values.code + "] = " + encrypted);
        var randomString = require('random-string');
        values.code = randomString({ length: 6 })        
        next();
    }


};
