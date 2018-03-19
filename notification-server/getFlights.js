const osmosis = require('osmosis');
const sns = require('./sns');
const timeseries = require('./timeseries');

module.exports = {
  getFlightPrices: (user) => {
    const fares = {
      outbound: [],
      return: []
    }
    osmosis
    .get("https://www.southwest.com")
    .submit(".booking-form--form", {
        twoWayTrip: true,
        airTranRedirect: "",
        returnAirport: "RoundTrip",
        outboundTimeOfDay: "ANYTIME",
        returnTimeOfDay: "ANYTIME",
        seniorPassengerCount: 0,
        fareType: "DOLLARS",
        originAirport: user.originAirport.S,
        destinationAirport: user.destinationAirport.S,
        outboundDateString: user.departDate.S,
        returnDateString: user.returnDate.S,
        adultPassengerCount: user.passengers.N
    })
    .find("#faresOutbound .product_price")
    .then((priceMarkup) => {
        const matches = priceMarkup.toString().match(/\$.*?(\d+)/);
        const price = parseInt(matches[1]);
        fares.outbound.push(price);
    })
    .find("#faresReturn .product_price")
    .then((priceMarkup) => {
        const matches = priceMarkup.toString().match(/\$.*?(\d+)/);
        const price = parseInt(matches[1]);
        fares.return.push(price);
    })
    .done(() => {
      const newLowestOutgoingFare = Math.min(...fares.outbound);
      const newLowestRetunFare = Math.min(...fares.return);
      if(newLowestOutgoingFare + newLowestRetunFare < user.threshold.N) {
        sns.sendText(`${user.originAirport.S} <-> ${user.destinationAirport.S} \n`
            +`New Outgoing Fare: $${newLowestOutgoingFare}\n`
            +`New Return Fare: $${newLowestRetunFare}`, user.phone.S);
      }
      timeseries.ingestNewPrice(user.key.S, newLowestOutgoingFare + newLowestRetunFare);
    });
  }
}