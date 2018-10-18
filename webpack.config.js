const path = require('path')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')

const phaser = path.join(__dirname, '/node_modules/phaser/src/phaser.js')
const canvasInput = path.join(__dirname, '/node_modules/canvasinput/CanvasInput.js')
const server = path.join(__dirname, 'src/server')
const shared = path.join(__dirname, 'src/shared')
const envirmoment = process.env.BUILD_DEV || 'development'
const isProduction = envirmoment == 'production'

const definePlugin = new webpack.DefinePlugin({
  GAME_ENV: envirmoment,
  WEBGL_RENDERER: true,
  CANVAS_RENDERER: true,
  SHADER_REQUIRE: false
})

let settings = {
  entry: {
    game: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/client/index.js')
    ],
    styles: [
      path.resolve(__dirname, 'src/client/styles/body.less')
    ]
  },

  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist/client'),
    filename: '[name].bundle.js'
  },

  plugins: [
    definePlugin
  ],

  resolve: {
    alias: {
      'phaser': phaser,
      'canvasinput': canvasInput,
      'server': server,
      'shared': shared
    }
  },

  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: /(node_modules|bower_components|src\/server)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' }
        ],
        test: /\.less$/i
      },

      {
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ],
        test: /\.css/i
      },

      {
        test: /\.(ttf|woff|eot|woff2)$/i,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },

      { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
      { test: /canvasinput/, use: ['exports-loader?CanvasInput'] },

      {
        test: /\.vert|frag$/,
        loader: 'raw-loader',
        options: {
          name: '[path][name].[ext]'
        }
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        oneOf: [
          {
            resourceQuery: /load-inline/,
            use: 'json-loader'
          },

          { loader: 'file-loader' }
        ]
      },

      {
        test: /\.fnt/,
        use: [ { loader: 'file-loader' } ]
      },

      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            },
          },
        ],
      }
    ]
  }
}

if (isProduction) {
  settings.mode = 'production'
  settings.plugins.push(new CleanWebpackPlugin(['dist/client']))
  settings.plugins.push(new MinifyPlugin({
    keepClassName: true,
  }, {
    comments: false,
    sourceMap: false
  }))
  settings.plugins.push(new CompressionPlugin())
  settings.optimization = {
    minimize: false
  }
} else {
  settings.entry.editor = [
    'babel-polyfill',
    path.resolve(__dirname, 'src/editor/index.jsx')
  ]
  settings.plugins.push(new webpack.HotModuleReplacementPlugin())
  settings.watch = true
  settings.mode = 'development'
  settings.devtool = 'eval-source-map'
  settings.devServer = {
    port: 9000,
    host: '0.0.0.0',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  }
  settings.output.publicPath = settings.devServer.publicPath = 'http://localhost:9000/'
}

module.exports = settings
