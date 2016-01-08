var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');

module.exports = {
    entry: [
      'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
      'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
      './app/main.jsx' // Your appʼs entry point
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    module: {
	    loaders: [{
            test: /\.jsx?$/, 
            loaders: [/*'react-hot', */'babel']
        },
        {
          test: /\.css$/, // Only .css files
          loader: 'style!css' // Run both loaders
        }],

        noParse: /\.min\.js/
	},

    resolve: {
        extentions: ['js', 'jsx', 'scss']
    }
};