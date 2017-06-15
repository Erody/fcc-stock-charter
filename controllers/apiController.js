const request = require('request-promise-native');

exports.getStock = (req, res) => {
	console.log(req.query);
	request(`http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${req.query.stockName}&interval=1min&apikey=${process.env.ALPHAVANTAGE_KEY}`)
		.then(result => {
			return JSON.parse(result);
		})
		.then(json => res.json(json))
		.catch(err => console.error(err));
};

exports.test = (req, res) => {
	request(`http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=${process.env.ALPHAVANTAGE_KEY}`)
		.then(result => {
			return JSON.parse(result);
		})
		.then(json => res.json(json))
		.catch(console.error);
};