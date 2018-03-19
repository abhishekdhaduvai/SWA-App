const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const app = express();
const osmosis = require('osmosis');
const httpServer = http.createServer(app);

app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const node_env = process.env.node_env || 'development';
const credentials = require('./credentials');
const scraper = require('./getFlights');

if (node_env === 'development') {
  var devConfig = require('./localConfig.json')[node_env];
} else {
  //Do Something
}

AWS.config.update({
  accessKeyId: credentials.aws.accessKeyId,
  secretAccessKey: credentials.aws.secretAccessKey,
  region:'us-west-1'
});

var params = {
	TableName: 'UserFlights',
	ReturnConsumedCapacity: 'TOTAL'
};

var flights = [];

var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

dynamodb.scan(params, (err, data)=>{
  if(err) {
    console.log('There was an error fetching data from DynamoDB');
  }
  else {
    flights = data;
  }  
});

app.post('/lambda', (req, res) => {
  flights = req.body.data.Items;
  res.send(200);
});

setInterval(() => {
  flights.forEach(item => {
    scraper.getFlightPrices(item)
  });
}, 600000);

httpServer.listen(process.env.VCAP_APP_PORT || 5000, function () {
	console.log ('Server started on port: ' + httpServer.address().port);
});

module.exports = app;