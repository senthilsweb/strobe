var _ = require("lodash");
module.exports = _.merge(_.cloneDeep(require("../services/BaseController")),{
    
  'index' : function(req,res){
      res.view();
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
