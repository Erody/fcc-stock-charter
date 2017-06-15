import {createChart} from './highChart'

socket.on('stockChange', data => {
	console.log(`Received stockChange:`);
	console.log(data);
	createChart([{name: data.stockName, data: data.data}])
});