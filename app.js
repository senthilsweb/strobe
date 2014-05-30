// Start sails and pass it command line arguments
//require('sails').lift({"port": 2455});
require('sails').lift(process.env.PORT || 2455);
