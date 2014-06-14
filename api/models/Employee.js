var _ = require("lodash");
module.exports = _.merge(_.cloneDeep(require("../services/BaseModel")), {

    attributes: {
        /**
        * Strips the password out of the json
        * object before its returned from waterline.
        * @return {object} the model results in object form
        */
        toJSON: function () {
            // this gives you an object with the current values
            var obj = this.toObject();          
            delete obj.password;
            delete obj.confirmPassword;
            return obj;
        }
    },


    /**
    * Hash the users password with bcrypt
    * @param  {object}   user            the object of the submitted user data
    * @param  {Function} cb[err, user]   the callback to be used when bcrypts done
    */
    beforeCreate: function (obj, cb) {
        var easycrypto = require('easycrypto').getInstance();
        var encryptedPassword = easycrypto.encrypt(obj.password, 'mypassword'); //"mypassword" -> is the password to be given during decryption
        obj.password = encryptedPassword
        obj.confirmPassword = encryptedPassword
        console.log("Employee before create")
        return cb(null, user);
    }
});
