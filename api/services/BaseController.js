/**
 * api/services/BaseController.js
 * 
 * Base controller for all sails.js controllers. This just contains some common code
 * that every controller uses
 * Reference : https://gist.github.com/tarlepp/869165914c26d753dbd8
 */
'use strict';

var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
    /**
    * Generic count action for controller.
    *
    * @param   {Request}   request
    * @param   {Response}  response
    */
      'index' : function(req,res,next){
      console.log("response type = " + req.wantsJSON)
      if(req.wantsJSON)
          next();
      else
          res.view();
  },
    count: function (request, response) {
        console.log("Inside count");
        var Model = actionUtil.parseModel(request);
        
        Model
            .count(actionUtil.parseCriteria(request))
            .exec(function found(error, count) {
                response.json({ count: count });
            });
    }
};