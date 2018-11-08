﻿const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpack = require('clean-webpack-plugin')
const ExtractTextWebpackPlguin = require('extract-text-webpack-plugin')
const path = require('path')

const baseConfig = {
	entry: {
		react: ['react']
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/[name].[chunkhash].js'
	},
	optimization: {
		splitChunks: {
			name: 'react',
			chunks: 'initial',
			minChunks: 2
		}
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ExtractTextWebpackPlguin.extract({
					fallback: {
						loader: 'style-loader'
					},
					use: [
						{
							loader: 'css-loader'
						}
					]
				})
			}
		]
	},
	plugins: [
		new CleanWebpack(path.resolve(__dirname, 'dist')),
		new ExtractTextWebpackPlguin({
			filename: 'css/[name].[hash].css'
		})
	]
}

const generatePage = function({
	title = '',
	entry = '',
	template = './src/index.html',
	name = '',
	chunks = []
} = {}) {
	return {
		entry,
		plugins: [
			new HtmlWebpackPlugin({
        chunks,
				template,
				title,
				filename: name + '.html'
			})
		]
	}
}

const pages = [
	generatePage({
		title: 'page A',
		entry: {
			a: './src/pages/a'
		},
		name: 'a',
		chunks: ['react', 'a']
	}),
	generatePage({
		title: 'page B',
		entry: {
			b: './src/pages/b'
		},
		name: 'b',
		chunks: ['react', 'b']
	})
]

module.exports = pages.map(page => merge(baseConfig, page))
