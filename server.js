#!/bin/env node

var http = require('http');

http.createServer(function(req, res) {
	
	res.writeHeader(200, {'Content-Type' : 'text/plain'});
	res.done('Hello World!');
	
}).listen(process.env.OPENSHIFT_NODEJS_PORT || 8080);