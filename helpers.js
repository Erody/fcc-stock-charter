function renameProperty (object, oldName, newName) {
	// Do nothing if the names are the same
	if (oldName == newName) {
		return object;
	}
	// Check for the old property name to avoid a ReferenceError in strict mode.
	if (object.hasOwnProperty(oldName)) {
		object[newName] = object[oldName];
		delete object[oldName];
	}
	return object;
}

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
const moment = exports.moment = require('moment');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// Some details about the site
exports.siteName = `Stock market charter`;

exports.transformForHighchart = (data) => {
	const metadata = data['Meta Data'];
	// const timeseries = data['Time Series (1min)'];
	const timeseries = data['Time Series (Daily)'];

	return Object
		.entries(timeseries)
		.map(time => {
			const timestamp = time[0];
			const unixTimestamp = moment(timestamp).format('x');
			const values = time[1];
			Object.keys(values).map(key => {
				renameProperty(values, key, key.slice(3))
			});
			const { open, high, low, close, volume} = values;
			return [Number(unixTimestamp), Number(close)];
		})
		.sort((a, b) => {
			return a[0] > b[0] ? 1: -1;
		});

};