/**
 * @file base.js
 */
const path = require('path');
const glob = require('glob');

// 将CSS抽离成单独文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// html入口
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 清理构建产物，新版按需引入，不能直接引入
// TypeError: CleanWebpackPlugin is not a constructor
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 构建日志优化提示
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const autoprefixer = require('autoprefixer');

const projectRoot = process.cwd();

const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];

    const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));
    Object.keys(entryFiles).map((index) => {
        const entryFile = entryFiles[index];
        const match = entryFile.match(/src\/(.*)\/index\.js/);
        const pageName = match && match[1];
        entry[pageName] = entryFile;
        const htmlWebpackPlugin = new HtmlWebpackPlugin({
            template: path.join(projectRoot, `src/${pageName}/index.html`),
            filename: `${pageName}.html`,
            // 使用chunk
            chunks: ['vendors', pageName],
            // 打包出的chunk自动注入
            inject: true,
            minify: {
                html5: true,
                // 删除空格和换行符，若preserveLineBreaks参数设为true，则保留了换行符
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false,
            },
        });
        return htmlWebpackPlugins.push(htmlWebpackPlugin);
    });
    return {
        entry,
        htmlWebpackPlugins,
    };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
    entry,
    module: {
        rules: [{
            test: /\.js$/,
            use: [
                'babel-loader',
                'eslint-loader',
            ],
        },
        {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader, // 和style-loader互斥
                'css-loader',
            ],
        },
        {
            test: /\.less$/,
            use: [
                MiniCssExtractPlugin.loader, // 和style-loader互斥
                'css-loader',
                'less-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [
                            // 浏览器支持版本控制在package.json browserslist
                            autoprefixer(),
                        ],
                    },
                },
                {
                    loader: 'px2rem-loader',
                    options: {
                        // 1rem = 75px
                        remUnit: 75,
                        // 小数点位数
                        remPrecesion: 8,
                    },
                },
            ],
        },
        {
            test: /\.(png|jpg|gif|jpeg)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name]_[hash:8].[ext]',
                },
            }],
        },
        {
            test: /\.(otf|woff2|eot|ttf|woff)$/,
            use: [
                'file-loader',
            ],
        },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css',
        }),
        new FriendlyErrorsWebpackPlugin(),
        // 捕获错误处理
        function errorPlugin() {
            // v3.0版本
            // this.plugin('done', (stats) => {
            // v4.0
            this.hooks.done.tap('done', (stats) => {
                if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
                    /* eslint-disable no-console */
                    console.log('build error');
                    /* eslint-enable */
                    process.exit(1);
                }
            });
        },
    ].concat(htmlWebpackPlugins),
    stats: 'errors-only',
};
