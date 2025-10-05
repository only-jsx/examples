import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
    mode: 'development',
    entry: {
        app: './src/main.tsx',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '...'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            hash: true,
        }),
    ],
    output: {
        publicPath: '/router',
    },
    devtool: 'inline-source-map',
    devServer: {
        port: 3000,
        open: '/router#/router',
        hot: true,
        historyApiFallback: true,
        static: false,
    }
};