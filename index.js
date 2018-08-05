/*Primary API File*/

//Dependecies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

//Instantiate the http server
var httpServer = http.createServer(function(req, res){
	universalServer(req,res);
});

//Start the http server
httpServer.listen(config.httpPort, function(){
	console.log("Server is listening on port "+config.httpPort+"\nPress Ctrl + c to terminate");
});

//Universal server
var universalServer = function(req, res){
	//Get url and parse
	var parsedUrl = url.parse(req.url,true);

	//Get url path
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');

	//Get the query string as an object
	var queryStringObject = parsedUrl.query;

	//Get HTTP method
	var method = req.method.toLowerCase();

	//Get headers as an object
	var headers = req.headers;

	//Get payload if any
	var decoder = new StringDecoder('utf-8');
	var buffer = '';
	req.on('data',function(data){
		buffer += decoder.write(data);
	});

	req.on('end',function(){
		buffer += decoder.end();

		//Handler of the response
		var choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		//Constuct data object to send to the handler
		var data = {
			'trimmedPath' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : buffer
		};

		//Route request to choosen handler
		choosenHandler(data,function(statusCode,payload){
			//Status code
			statusCode = typeof(statusCode) == 'number' ? statusCode: 200;

			//Use payload callback or default
			if (router.hello)
			{
				var message = "Welcome to the hello api!";
				payload = typeof(payload) == 'string' ? payload: {message};
			}
			else
			{
				payload = typeof(payload) == 'object' ? payload: {};	
			}
			
			//convert payload into a string
			var payloadString = JSON.stringify(payload);

			//Return response
			res.setHeader('content-type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

		//Console log request path
		console.log('Returning response:',statusCode,payloadString);
		});
	}); 
};

//Define handlers
var handlers = {};

//Ping Handler
handlers.ping = function(data,callback){
	callback(200);
};

//Welcome Handler
handlers.hello = function(data,callback){
	callback(201);
};

//Not Found Handler
handlers.notFound = function(data,callback){
	callback(404);
};

//Request router
var router = {
	'ping' : handlers.ping,
	'hello' : handlers.hello
};