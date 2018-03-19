const AWS = require('aws-sdk');
const credentials = require('./credentials');

AWS.config.update({
  accessKeyId: credentials.aws.accessKeyId,
  secretAccessKey: credentials.aws.secretAccessKey,
  region:'us-east-1'
});

const sns = new AWS.SNS({apiVersion: '2010-03-31'});

module.exports = {
  sendText: (message, phone) => {
    const params = {
      Message: message,
      PhoneNumber: `+1${phone}`,
      Subject: 'SWA Ticket Price Alert'
    }
    console.log('Sending a Text...');
    sns.publish(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
  }
}