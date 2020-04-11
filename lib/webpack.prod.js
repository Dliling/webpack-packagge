/**
 * @file prod.js
 */

const merge = require('webpack-merge');
// css压缩
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// 基础库不打包，直接CDN引入
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const cssnano = require('cssnano');

const baseConfig = require('./webpack.base');

const prodConfig = {
    mode: 'production',
    plugins: [
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: cssnano,
        }),
        // 基础库提取
        new HtmlWebpackExternalsPlugin({
            externals: [
                {
                    module: 'react',
                    entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
                    global: 'React',
                },
                {
                    module: 'react-dom',
                    entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
                    global: 'ReactDOM',
                },
            ],
        }),
    ],
    optimization: {
    // 提取公共包
        splitChunks: {
            // 分离包的最小体积
            minSize: 0,
            cacheGroups: {
                commons: {
                    name: 'vendors',
                    chunks: 'all',
                    // 最少引用次数
                    minChunks: 2,
                },
            },
        },
    },
};

module.exports = merge(baseConfig, prodConfig);
