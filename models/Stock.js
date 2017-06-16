const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: 'Name of stock has to be unique',
		required: 'You must supply a stock name.'
	},
	data: {
		type: [],
		required: 'You must supply data.'
	}
});

module.exports = mongoose.model('Stock', stockSchema);