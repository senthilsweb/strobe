var _ = require("lodash");
module.exports = _.merge(_.cloneDeep(require("../services/BaseController")),{
    
  'index' : function(req,res){
      res.view();
      
  },
  forgotPassword : function (req, res) {
        //decrypt the password and then check
        var easycrypto = require('easycrypto').getInstance();  
   var params = req.params.all();
   console.log("email is :" + params.email);
   Employee.findOne({ email: params.email}, function (err, employee) {
            if (err) {
                return console.log(err);
                // The User was found successfully!
            } else {
                if (employee === undefined) {
                    res.send(500, " Failed....")
                } else {
                    //Added by Paulomi: to decrypt the passowrd
                    var decryptedPassword = easycrypto.decrypt(employee.password, 'mypassword');    
                    employee.password =  decryptedPassword;
                    console.log(employee);
                    res.send(200, employee);
                }
                //console.log("Employee found:", employee.name);
            }
        });  
  },
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to CasestudyController)
   */
  _config: {
      blueprints: {
            actions: true,
            rest: true,
            shortcuts: true
        }
  }

  
});
