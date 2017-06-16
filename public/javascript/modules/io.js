import {createChart} from './highChart'

exports.listen = () => {
	socket.on('stockChange', data => {
		console.log(`Received stockChange:`);
		console.log(data);
		createChart(data);
	})
};