module.exports = {
	  renderHtmlfromTemplate: function(args) {
            var ejs = require('ejs');
            var fs = require("fs");
            var tmpl = fs.readFileSync(args.tempPath, "utf-8");
            var html = ejs.render(tmpl, args.data);
	  	    return html;
	  }
}