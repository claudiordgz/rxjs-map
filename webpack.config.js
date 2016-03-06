var webpack = require('webpack'),
    path = require('path');


// webpack.config.js
module.exports = {
    entry: [
        './main.js'
    ],
    output: {
        path: __dirname + '/lib',
        filename: 'bundle.js',
        library: "rxjsMap",
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                loader: "babel-loader",
                // Skip any files outside of your project's `src` directory
                exclude: /(node_modules)/,
                // Only run `.js` and `.jsx` files through Babel
                test: /\.js?$/
            }
        ],
        postLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/, // do not lint third-party code
                loader: 'jshint-loader'
            }
        ],
        jshint: {
            // Display JSHint messages as webpack errors
            emitErrors: true,

            // fail the build on JSHInt errors
            failOnHint: false
        }
    },
    plugins: [

    ]
};