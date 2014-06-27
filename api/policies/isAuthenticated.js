/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function (req, res, next) {
    /* var action = req.param('forgotPassword');
    var params = req.params.all();
    console.log("action is: " + params.action);
    if (action == "forgotPassword")
    { 
    req.session.authenticated = true; 
    }
    else { 
    req.session.authenticated = false; 
    }*/
    // User is allowed, proceed to the next policy, 
    // or if this is the last policy, the controller
    if (req.session.authenticated) {
        console.log("Is Authenticated");
        return next();
    }
    else {
        console.log("Is not authenticated");
        // res.send(403);
        //return res.forbidden('You are not permitted to perform this action.');
        return res.forbidden('You are not permitted to perform this action.');
        //res.redirect('/403');
    }

    // User is not allowed
    // (default res.forbidden() behavior can be overridden in `config/403.js`)
    //return res.forbidden('You are not permitted to perform this action.');
};
