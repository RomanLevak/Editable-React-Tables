const path = require('path')
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports =
	{
		entry: './src/scripts/index.jsx',
		output:
		{
			path: path.resolve('./public/scripts'),
			filename: 'bundle.js'
		},
		module: {
			rules:
				[
					{
						test: /\.jsx?$/,
						exclude: '/node_modules/',
						loader: 'babel-loader'
					},
					{
						test: /\.less$/,
						use:
							[
								{ loader: 'style-loader' },
								{ loader: 'css-loader' },
								{ loader: 'less-loader' }
							]
					}
				]
		},
		devtool: 'eval',
		mode: 'development',
		// watch: true,
		// plugins:
		// 	[
		// 		new BrowserSyncPlugin
		// 			({
		// 				port: 6060,
		// 				files: ['./public/*.html', './public/styles/*.css'],
		// 				server: { baseDir: ['public'] }
		// 			})
		// 	]
	}