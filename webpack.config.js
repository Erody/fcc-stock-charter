const path = require('path');

module.exports = {
	entry: {
		App: './public/javascript/frontend.js'
	},
	output: {
		// path is a built in node module
		// __dirname is a variable from node that gives us the
		path: path.resolve(__dirname, 'public', 'dist'),
		// we can use "substitutions" in file names like [name] and [hash]
		// name will be `App` because that is what we used above in our entry
		filename: '[name].bundle.js'
	},
	module: {
		loaders: [{
			test: /.js$/,
			loader: 'babel-loader',
			include: [
				path.resolve(__dirname, 'public/javascript')
			],
			query: {
				presets: ['es2015']
			}
		}]
	}
};