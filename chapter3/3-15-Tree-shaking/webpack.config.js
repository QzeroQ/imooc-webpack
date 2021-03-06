const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const PurifyCssWebpack = require('purifycss-webpack')
const path = require('path')
const globAll = require('glob-all')

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js'
  },
  output: {
    /* return the absolute path of the current working directory */
    path: path.resolve(__dirname, 'dist'),
    /* Introducing resource paths */
    // publicPath: './dist/',
    /* init packaged file name */
    filename: '[name].bundle.js',
    /* dynamic packaged file name */
    chunkFilename: '[name].bundle.js'
  },
  optimization: {
    /* package, Multiple files can only work */
    // [splitChunks](https://webpack.docschina.org/plugins/split-chunks-plugin/)
    splitChunks: {
      // name of the split chunk
      name: 'vendor',
      // which chunks will be selected for optimization, "initial" | "all"(default) | "async",
      chunks: 'initial',
      // mini size for a chunk to be generated.
      minSize: 30000,
      // mini number of chunks that must share a module before splitting.
      minChunks: 2
      // max number of parallel requests when on-demand loading.
      // maxAsyncRequests: 1,
      // max number of parallel requests at an entry point
      // maxInitialRequests: 1
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        /* Processe from the back to the front */
        use: ExtractTextWebpackPlugin.extract({
          /* `loader` should be used when the CSS is not extracted */
          fallback: {
            /* Adds CSS to the DOM by injecting a <style> tag */
            loader: 'style-loader',
            options: {
              /* Reuses a single <style></style> element */
              singleton: true,
              /* load CSS by passing a XX function */
              transform: './css.transform.js'
            }
          },
          use: [
            {
              /* interprets @import and url() like import/require() and will resolve them. */
              loader: 'css-loader',
              options: {
                /* compress? */
                minimize: true,
                /* Enable/Disable css-modules */
                modules: true,
                /* Configure the generated ident */
                localIdentName: '[path][name]_[local]_[hash:base64:5]'
              }
            },
            {
              /* put css-loader below */
              loader: 'postcss-loader',
              options: {
                /*  webpack requires an identifier (ident) in options when {Function}/require is used (Complex Options). The ident can be freely named as long as it is unique. It's recommended to name it (ident: 'postcss') */
                ident: 'postcss',
                plugins: [
                  /* css3 Attribute added vendor prefix */
                  // 'autoprefixer' <-- already included in postcss-cssnext
                  require('autoprefixer')(),
                  /* Use future css syntax */
                  require('postcss-cssnext')(),
                  /* Compression optimization css */
                  require('cssnano')()
                ]
              }
            },
            {
              /* put css-loader below */
              loader: 'sass-loader'
            }
          ]
        })
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // presets: ['env'],
              presets: ['@babel/preset-env'],
              /* uglifyjswebpackplugin no working, use babel-plugin-lodash can compress lodash */
              plugins: ['lodash']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    /* Extract text from a bundle, or bundles, into a separate file. */
    new ExtractTextWebpackPlugin({
      filename: '[name].min.css',
      /* Extract from all additional chunks(by default it extracts only from the initial chunk) */
      allChunks: false
    }),
    /* put ExtractTextWebpackPlugin below */
    new PurifyCssWebpack({
      // glob: 加载多路径
      paths: globAll.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/*.js')
      ])
    }),
    /* js compress */
    new UglifyJsWebpackPlugin()
  ]
}
