const seriesOptions = [];
const names = ['MSFT', 'AAPL', 'GOOG'];
let seriesCounter = 0;

/**
 * Create the chart when all data is loaded
 * @returns {undefined}
 */
const createChart = exports.createChart = (options) => {

	console.log(options);

	Highcharts.stockChart('stockChart', {

		rangeSelector: {
			selected: 4
		},

		yAxis: {
			labels: {
				formatter: function () {
					return (this.value > 0 ? ' + ' : '') + this.value + '%';
				}
			},
			plotLines: [{
				value: 0,
				width: 2,
				color: 'silver'
			}]
		},

		plotOptions: {
			series: {
				compare: 'percent',
				showInNavigator: true
			}
		},

		tooltip: {
			pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
			valueDecimals: 2,
			split: true
		},

		series: options
	});
};

// $.each(names, function (i, name) {
//
// 	$.getJSON(`${window.location.href}api/getInitialStocks`, function (data) {
//
// 		seriesOptions[i] = {
// 			name,
// 			data
// 		};
//
// 		// As we're loading the data asynchronously, we don't know what order it will arrive. So
// 		// we keep a counter and create the chart when all the data is loaded.
// 		seriesCounter += 1;
//
// 		if (seriesCounter === names.length) {
// 			createChart(seriesOptions);
// 		}
// 	});
// });

exports.init = () => {
	$.getJSON(`${window.location.href}api/getInitialStock`, function (initialData) {
		createChart(initialData)
	});
};