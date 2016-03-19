var path = require('path');
var autoprefixer = require('autoprefixer');
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
			loaders: ['style', 'css', 'postcss-loader', 'sass?sourceMap']
		},
		{
			test: /\.html$/,
			loader: 'raw-loader'
		},
		{
			test: /\.(png|jpg)$/,
			loader: 'url-loader?limit=8192' // inline base64 URLs for <=8k images, direct URLs for the rest
		}],
		
		noParse: /\.min\.js/
	},
	
	postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
	
	resolve: {
		extensions: ['', '.js', '.jsx', '.scss']
	}
};
