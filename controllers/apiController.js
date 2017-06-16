const request = require('request-promise-native');
const mongoose = require('mongoose');
const Stock = mongoose.model('Stock');

exports.getStock = (req, res) => {
	console.log(req.query);
	// request(`http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${req.query.stockName}&interval=1min&apikey=${process.env.ALPHAVANTAGE_KEY}`)
	// 	.then(result => {
	// 		return JSON.parse(result);
	// 	})
	// 	.then(json => res.json(json))
	// 	.catch(err => console.error(err));
	request(`http://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${req.query.stockName}&outputsize=full&apikey=${process.env.ALPHAVANTAGE_KEY}`)
		.then(result => {
			return JSON.parse(result);
		})
		.then(json => res.json(json))
		.catch(console.error);
};

exports.getInitialStock = async (req, res) => {
	const stocks = await Stock.find();
	res.json(stocks);
};

exports.test = (req, res) => {
	request(`http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=${process.env.ALPHAVANTAGE_KEY}`)
		.then(result => {
			return JSON.parse(result);
		})
		.then(json => res.json(json))
		.catch(console.error);

};

exports.removeStock = async (req, res) => {
	try {
		await Stock.remove({name: req.params.stock.toUpperCase()});
		res.json({status: 'success'})
	} catch(e) {
		res.json({status: 'error', message: e})
	}
};