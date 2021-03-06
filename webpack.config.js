var Webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var path = require('path');

module.exports = {

    entry: ['babel-polyfill', './src/ccNetVizMultiLevel.js'],

    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'ccNetViz.js',
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin()
        ]
    },

    /**
     *   | devtool value  | build   | rebuild | production  | quality
     *   | 'source-map'   | slow    | slow    | yes         | original source
     */
    devtool: 'source-map',

    module: {
        rules: [
            // Loader 1
            {
                // Target Files
                // test: /\.js?$/g,

                // Excluded folders
                exclude: /(node_modules|bower_components)/,

                // The Loader
                loader: 'babel-loader',

                // Loader Configurations
                query: {
                    presets: ["env"]
                },
            },

            // Loader 2 
            {
                test: /\.worker\.js$/,
                use: { 
                    loader: 'worker-loader',
                    options: { inline: true },
                 },
            }
        ]
    },
    plugins: [
        new Webpack.LoaderOptionsPlugin({
            debug: true
        })
    ],
};