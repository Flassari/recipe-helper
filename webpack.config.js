var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');

module.exports = {
	entry: [
		'./app/app.jsx' // Your appʼs entry point,
	],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/, 
			loaders: [/*'react-hot', */'babel']
		},
		{
			test: /\.scss$/,
			loaders: ["style", "css?sourceMap", "sass?sourceMap"]
		}],
		
		noParse: /\.min\.js/
	},

	resolve: {
		extensions: ['', '.js', '.jsx', '.scss']
	}
};
