var config = require('../config/config'), 
    request = require('request');



module.exports = function(req, res, next) {
  if(req.body.address) {
      //This code just formats the address so that it doesn't have space and commas using escape characters
      var addressTemp = req.body.address;
      var addressTemp2 = addressTemp.toLowerCase();
      var addressTemp3 = addressTemp2.replace(/\s/g, "%20");
      var addressTemp4 = addressTemp3.replace(/,/g , "%2C");
      
    //Setup your options q and key are provided. Feel free to add others to make the JSON response less verbose and easier to read 
    var options = { 
      q: addressTemp4,
      key: config.openCage.key,  
    }

    //Setup your request using URL and options - see ? for format
      //Format like so https://api.opencagedata.com/geocode/v1/json?q=Moabit%2C%20Berlin&key=YOUR-API-KEY&language=en&pretty=1
    request({
      url: 'https://api.opencagedata.com/geocode/v1/json?q=' + options.q + '&key=' + options.key,
      qs: options
      }, function(error, response, body) {
        //For ideas about response and error processing see https://opencagedata.com/tutorials/geocode-in-nodejs
        //1859 Gallo Drive, Powell, Ohio, 43065, United States is more likely to yield a correct response

        //Catch errors
        if (error) {
            console.log(error.message);
        }

        //Make sure we get result, code 200
        if (response.statusCode === 200) {
            //JSON.parse to get contents. Remember to look at the response's JSON format in open cage data
            //Assumption: if we get a result we will take the coordinates from the first result returned
            var json_parsed = JSON.parse(body).results[0];

            /*Save the coordinates in req.results ->
            this information will be accessed by listings.server.model.js
            to add the coordinates to the listing request to be saved to the database.
            */
            //  req.results = stores you coordinates
            req.results = json_parsed.geometry;
        }
        next();
    });
  } else {
    next();
  }
};  