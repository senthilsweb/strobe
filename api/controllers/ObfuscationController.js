var _ = require("lodash");
module.exports = _.merge(_.cloneDeep(require("../services/BaseController")), {

    /*'index': function (req, res) {
        res.view();

    },*/
    obfuscate: function (req, res) {
        var response = {};
        //decrypt the password and then check
        var easycrypto = require('easycrypto').getInstance();
        var params = req.params.all();
        console.log("text is :" + params.text);
        console.log("action is :" + params.action);
        //to encrypt/decrypt the text
        var encryptedORDecryptedText = params.action == "encrypt" ? easycrypto.encrypt(params.text, 'obfuscation')
                                                                  : easycrypto.decrypt(params.text, 'obfuscation');

        console.log(encryptedORDecryptedText);
        response.encryptedORDecryptedText = encryptedORDecryptedText;
        res.send(200, response);

    },
    /**
    * Overrides for the settings in `config/controllers.js`
    * (specific to ObfuscationController)
    */
    _config: {
        /*blueprints: {
            actions: true,
            rest: true,
            shortcuts: true
        }*/
    }


});
