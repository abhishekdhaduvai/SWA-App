const AWS = require('aws-sdk');
const axios = require('axios');
const config = require('./config');

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region:'us-west-1'
});

var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    
exports.handler = (event, context, callback) => {
  var params = {
    TableName: 'UserFlights',
    ReturnConsumedCapacity: 'TOTAL'
  };

  dynamodb.scan(params, (err, data) => {
    if(err) {
      console.log('Error getting data from dynamoDB');
    }
    else {
      axios.post(config.microservice, {data}, {})
      .then(res => {console.log('Sent new data to the microservice')})
      .catch(err => {console.log('Error sending data to the microservice')})
    }
  });
};