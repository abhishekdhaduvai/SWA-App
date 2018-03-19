const http = require('http');
const axios = require('axios');
const WebSocket = require('ws');

const node_env = process.env.node_env || 'development';
const config = require('./localConfig.json')[node_env];

const getToken = () => {
  const headers = {
    Authorization: `Basic ${config.base64Credentials}`
  }
  return axios.get(`${config.uaaURL}/oauth/token?grant_type=client_credentials`, {headers})
  .then(res => {
    return res.data.access_token;
  });
}

const ingestNewPrice = (key, price) => {
  console.log('USER KEY ', key)
  getToken().then(token => {
    var endpoint = "wss://gateway-predix-data-services.run.aws-usw02-pr.ice.predix.io/v1/stream/messages";
    const ws = new WebSocket(endpoint,
      [],
      {
        'headers':{
        'predix-zone-id': config.timeseriesZoneId,
        'content-type': 'application/json',
        'origin': '*',
        'authorization': `Bearer ${token}`
        } 
      }
    );
    ws.on('error', (err) => {
      console.log("Error opening a WS channel");
    });
    ws.on('open', function (){
      console.log("Websocket to Time Series opened!");
      var payload = {
        "messageId": Date.now(),
        "body": [
          {
            "name": key,
            "datapoints": [
              [
                Date.now(),
                price,
                3
              ]
            ]
          }
        ]
      }
      console.log("payload ",JSON.stringify(payload));
      ws.send(JSON.stringify(payload));      
    });
  })
}

module.exports = {
  ingestNewPrice: ingestNewPrice
}