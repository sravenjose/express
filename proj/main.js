var express = require('express')
var app = express()
var xlsxtojson = require("xlsx-to-json");


app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});

// configuration

app.post('/api/xlstojson', function(req, res) {
	xlsxtojson({
		input: "subjects.xlsx",  
	    output: "output.json", 
	    lowerCaseHeaders:true
	}, function(err, result) {
	    if(err) {
	      res.json(err);
	    } else {
	      res.json(result);
	    }
	});
});
app.listen(3000)