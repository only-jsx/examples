const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        app: './index.jsx',
    },
    resolve: {
        extensions: ['.jsx', '...'],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ]
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            [
                                '@babel/plugin-transform-react-jsx',
                                {
                                    'runtime': 'automatic',
                                    'importSource': 'only-jsx'
                                }
                            ]
                        ],
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ],
    devtool: 'inline-source-map',
    devServer: {
        static: false,
        hot: true,
        port: 9000,
    }
};