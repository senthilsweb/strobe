'use strict';
var _randString = require('random-string');
module.exports = { 

   beforeCreate: function (values, next) { 
        console.log("beforeCreate (Start)")      
        values.code = _randString({ length: 6 })         
        next();
        console.log("beforeCreate (End)")      
    }
};