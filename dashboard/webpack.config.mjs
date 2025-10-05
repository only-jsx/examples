import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

export default {
    mode: 'development',
    entry: {
        app: './src/index.tsx',
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
            template: './src/index.html',
            hash: true,
        }),
        new CopyPlugin({
            patterns: [
                { from: 'public', to: '' },
            ],
        })
    ],
    devtool: 'inline-source-map',
    devServer: {
        port: 3000,
        static: false,
        hot: true,
    }
};