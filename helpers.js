Object.prototype.renameProperty = function (oldName, newName) {
	// Do nothing if the names are the same
	if (oldName == newName) {
		return this;
	}
	// Check for the old property name to avoid a ReferenceError in strict mode.
	if (this.hasOwnProperty(oldName)) {
		this[newName] = this[oldName];
		delete this[oldName];
	}
	return this;
};

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
	const timeseries = data['Time Series (1min)'];

	return Object.entries(timeseries).map(time => {
		const timestamp = time[0];
		const unixTimestamp = moment(timestamp).format('x');
		const values = time[1];
		Object.keys(values).map(key => {
			values.renameProperty(key, key.slice(3))
		});
		const { open, high, low, close, volume} = values;
		return [unixTimestamp, close];
	});

};