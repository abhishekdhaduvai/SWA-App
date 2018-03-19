
var http = require('http');
var express = require('express');
var jsonServer = require('json-server');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var UUID = require('uuid-js');
var AWS = require('aws-sdk');
var credentials = require('./credentials');

var app = express();
var httpServer = http.createServer(app);
app.set('trust proxy', 1);

var node_env = process.env.node_env || 'development';

if (node_env === 'development') {
  var devConfig = require('./localConfig.json')[node_env];
} else {
  
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, process.env['base-dir'] ? process.env['base-dir'] : '../')));

var emails = [];

AWS.config.update({
  accessKeyId: credentials.aws.accessKeyId,
  secretAccessKey: credentials.aws.secretAccessKey,
  region:'us-west-1'
});

var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var params = {
	TableName: 'UserFlights',
	ReturnConsumedCapacity: 'TOTAL'
};

dynamodb.scan(params, (err, data) => {
	if(err) {
		console.log('Error getting data from dynamoDB');
	}
	else {
		data.Items.forEach(userInfo => {
			emails.push(userInfo.email.S);
		});
		console.log(emails);
	}
})

const updateDB = (res) => {
	console.log(params);
	dynamodb.putItem(params, (err, data) => {
		if(err){
			console.log('Error updating UserFlights');
			res.status(400).send('Error updating UserFlights');
		}
		else {
			console.log('Updated UserFlights');
			res.status(200).send('Started Tracking');
		}
	});
}

app.post('/submit', (req, res) => {
	params.Item = req.body.data.Item;
	params.Item.key = {};
	/*
	 * Create a new key combining the flights and dates for Time Series.
	 * Eg: SFOOAK03/12/201803/20/2018.
	 */ 
	params.Item.key.S = params.Item.originAirport.S
											+ params.Item.destinationAirport.S
											+ params.Item.departDate.S
											+ params.Item.returnDate.S;
	/*
	 * Check if the request has an overwrite flag.
	 * If there is no overwrite flag, this is the user's first attempt to update the DB.
	 * Check if the user is already tracking a flight.
	 * If not, update the DB. Otherwise, send an error.
	 */ 
	if(!req.body.data.overwrite) {
		if(tracking(req.body.data.Item.email.S)){
			res.status(400).send('Already Tracking');
		}
		else {
			updateDB(res);
		}
	}
	/*
	 * If the overwrite flag in the request is set to true, update the DB.
	 * This block is executed only when the user accepts the prompt to overwrite
	 *  the existing flight tracking
	 */
	else {
		updateDB(res);
	}
});

const tracking = (email) => {
	if(emails.indexOf(email) < 0) {
		emails.push(email);
		return false;
	}
	return true;
}

////// error handlers //////
// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler - prints stacktrace
if (node_env === 'development') {
	app.use(function(err, req, res, next) {
		if (!res.headersSent) {
			res.status(err.status || 500);
			res.send({
				message: err.message,
				error: err
			});
		}
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	if (!res.headersSent) {
		res.status(err.status || 500);
		res.send({
			message: err.message,
			error: {}
		});
	}
});

httpServer.listen(process.env.VCAP_APP_PORT || 5001, function () {
	console.log ('Server started on port: ' + httpServer.address().port);
});

module.exports = app;
