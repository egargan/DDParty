// const ExtractTextPlugin = require("extract-text-webpack-plugin");

// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// const GoogleFontsPlugin = require("google-fonts-webpack-plugin")

const Webpack = require('webpack');

const DotenvPlugin = require('webpack-dotenv-plugin');

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

var path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		home: './app/game/client/home.js',
	},
  output: {
    path: path.join(__dirname, '/public/js/'),
    filename: '[name].bundle.js'
  },
	plugins: [
		new Webpack.DefinePlugin({
			'process.env':{
				'NODE_ENV':JSON.stringify('production')
			}
		}),
		// new ExtractTextPlugin("../css/style.css"),
		new DotenvPlugin({
			sample: './.env.default',
			path: './.env'
		}),
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 3001,
			proxy: 'http://localhost:3000',
			files: [
				'./views/*.hbs',
				'./views/partials/*.hbs'
			]
		}),
	],
	module: {
		rules: [
			{
			  // Match woff2 in addition to patterns like .woff?v=1.1.1.
			  test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
			  use: {
			    loader: "url-loader",
			    options: {
			      // Limit at 50k. Above that it emits separate files
			      limit: 50000,

			      // url-loader sets mimetype if it's passed.
			      // Without this it derives it from the file extension
			      mimetype: "application/font-woff",

			      // Output below fonts directory
			      name: "./fonts/[name].[ext]",
			    }
			  },
			},
			{
				test: /\.scss$/,
				use: [
					"style-loader", // creates style nodes from JS strings
					"css-loader", // translates CSS into CommonJS
					"sass-loader" // compiles Sass to CSS
				]
			},
			{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
	        loader: 'babel-loader',
	        options: {
		        presets: ['env']
					}
				}
			}
		]
	},
	watch: true,
	devtool: 'source-map'
};
