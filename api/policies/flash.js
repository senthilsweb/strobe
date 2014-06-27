module.exports = function (req, res, next) {
    console.log("In flash");
    res.locals.flash = {};

    if (!req.session.flash){ console.log("In flash to go next"); return next();}

    res.locals.flash = _.clone(req.session.flash);

    // clear flash
    req.session.flash = {};

    next();
};