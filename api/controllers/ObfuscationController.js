var _ = require("lodash");
module.exports = _.merge(_.cloneDeep(require("../services/BaseController")), {

    'index': function (req, res) {
        res.view();

    },
    encryptordecrypt: function (req, res) {
        console.log(req.session);
        //decrypt the password and then check
        var easycrypto = require('easycrypto').getInstance();
        var params = req.params.all();
        console.log("text is :" + params.text);
        console.log("action is :" + params.action);
        //to encrypt/decrypt the text
        var encryptedORDecryptedText = params.action == "encrypt" ? easycrypto.encrypt(params.text, 'encrypt')
                                                                      : easycrypto.decrypt(params.text, 'decrypt');

        console.log(encryptedORDecryptedText);
        res.send(200, encryptedORDecryptedText);

    },
    /**
    * Overrides for the settings in `config/controllers.js`
    * (specific to ObfuscationController)
    */
    _config: {
        blueprints: {
            actions: true,
            rest: true,
            shortcuts: true
        }
    }


});
