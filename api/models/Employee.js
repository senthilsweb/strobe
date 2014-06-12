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
        var randomString = require('random-string');
        values.code = randomString({ length: 6 })        
        next();
    }


};
