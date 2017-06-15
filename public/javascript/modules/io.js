exports.connect = () => {
	socket.on('stockChange', stock => console.log(stock));
};
