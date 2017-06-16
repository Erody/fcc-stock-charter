import url from 'url';

const requestParser = (function() {
	const href = document.location.href;
	const urlObj = url.parse(href, true);

	return {
		href,
		urlObj,
		getQueryStringValue: (key) => {
			return ((urlObj && urlObj.query) && urlObj.query[key]) || null;
		},
		uriMinusPath: urlObj.protocol + '//' + urlObj.hostname
	};
})();

$('.addStockForm').submit(e => {
	e.preventDefault();
	const stock = $('#stockName');
	const baseUrl = requestParser.uriMinusPath;
	const data = { stock: stock.val(), baseUrl};
	socket.emit('newStock', data);
	stock.val('');
});

$('.removeStockForm').submit(e => {
	e.preventDefault();
	const stock = $('#stockNameRemove');
	const baseUrl = requestParser.uriMinusPath;
	const data = { stock: stock.val(), baseUrl};
	socket.emit('removeStock', data);
	stock.val('');
});