import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
    mode: 'development',
    entry: {
        app: './index.tsx',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '...'],
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
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
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