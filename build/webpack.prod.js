const path = require('path');
const webpack = require('webpack');
const webpackBase = require('./webpack.base.js');
const webpackMerge = require('webpack-merge');
// 清理 dist 文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// js压缩、优化插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// 抽取css extract-text-webpack-plugin不再支持webpack4，官方出了mini-css-extract-plugin来处理css的抽取
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = webpackMerge(webpackBase, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'vue-style-loader',
                    'css-loader',
                    'postcss-loader',
                ]
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'vue-style-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: path.resolve(__dirname, '../src/styles/var.less'),
                        }
                    },
                ]
            },
        ],
    },
    optimization: {
        splitChunks: {
            maxInitialRequests: 5,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                    priority: -10,
                    enforce: true,
                },
                common: {
                    test: /[\\/]src[\\/](common|components)[\\/]/,
                    name: 'common',
                    chunks: 'all',
                    priority: 20,
                },
            }
        },
        minimizer: [
            new UglifyJsPlugin({ // 压缩js
                cache: true, // 开启缓存
                parallel: true, // 开启多线程
                sourceMap: true, // 开启sourceMap
                uglifyOptions: {
                    warnings: false,
                    parse: {},
                    compress: {
                        drop_debugger: true,
                        drop_console: true
                    },
                    mangle: true, // Note `mangle.properties` is `false` by default.
                    output: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_fnames: false,
                }
            }),
            new OptimizeCSSAssetsPlugin({ // 压缩css
                cssProcessorOptions: {
                    safe: true
                }
            })
        ]
    },
    plugins: [
        // 自动清理 dist 文件夹
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, '../dist')],
            verbose: true, //开启在控制台输出信息
            dry: false,
            dangerouslyAllowCleanPatternsOutsideProject: true, // 输出文件前清理干净
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
            },
        }),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        // new MinifyPlugin(),
    ],
});

// module.exports = {
//     mode: 'production',
//     entry: {
//         index: path.resolve(__dirname, '../src/index.js'),
//     },
//     output: {
//         publicPath: './',
//         filename: 'js/[name].js',
//         path: path.resolve(__dirname, '../dist'),
//         chunkFilename: '[id].js'
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.css$/,
//                 exclude: /node_modules/,
//                 use: [
//                     MiniCssExtractPlugin.loader,
//                     'vue-style-loader',
//                     'css-loader',
//                     'postcss-loader',
//                 ]
//             },
//             {
//                 test: /\.less$/,
//                 exclude: /node_modules/,
//                 use: [
//                     MiniCssExtractPlugin.loader,
//                     'vue-style-loader',
//                     'css-loader',
//                     'postcss-loader',
//                     'less-loader',
//                     {
//                         loader: 'sass-resources-loader',
//                         options: {
//                             resources: path.resolve(__dirname, '../src/styles/var.less'),
//                         }
//                     },
//                 ]
//             },
//         ],
//     },
//     resolve: { // 设置模块如何被解析
//         alias: {
//             '@assets': path.resolve(__dirname, '../src/assets'),
//             '@biz': path.resolve(__dirname, '../src/biz'),
//             '@common': path.resolve(__dirname, '../src/common'),
//             '@components': path.resolve(__dirname, '../src/components'),
//             '@constants': path.resolve(__dirname, '../src/constants'),
//             '@mixins': path.resolve(__dirname, '../src/mixins'),
//             '@router': path.resolve(__dirname, '../src/router'),
//             '@mock': path.resolve(__dirname, '../src/mock'),
//             '@store': path.resolve(__dirname, '../src/store'),
//             '@styles': path.resolve(__dirname, '../src/styles'),
//             '@views': path.resolve(__dirname, '../src/views'),
//         },
//         extensions: ['*', '.less', '.css', '.js', '.vue']
//     },
//     optimization: {
//         splitChunks: {
//             maxInitialRequests: 5,
//             cacheGroups: {
//                 vendor: {
//                     test: /[\\/]node_modules[\\/]/,
//                     name: 'vendor',
//                     chunks: 'all',
//                     priority: -10,
//                     enforce: true,
//                 },
//                 common: {
//                     test: /[\\/]src[\\/](common|components)[\\/]/,
//                     name: 'common',
//                     chunks: 'all',
//                     priority: 20,
//                 },
//             }
//         },
//         minimizer: [
//             new UglifyJsPlugin({ // 压缩js
//                 cache: true, // 开启缓存
//                 parallel: true, // 开启多线程
//                 sourceMap: true, // 开启sourceMap
//                 uglifyOptions: {
//                     warnings: false,
//                     parse: {},
//                     compress: {
//                         drop_debugger: true,
//                         drop_console: true
//                     },
//                     mangle: true, // Note `mangle.properties` is `false` by default.
//                     output: null,
//                     toplevel: false,
//                     nameCache: null,
//                     ie8: false,
//                     keep_fnames: false,
//                 }
//             }),
//             new OptimizeCSSAssetsPlugin({ // 压缩css
//                 cssProcessorOptions: {
//                     safe: true
//                 }
//             })
//         ]
//     },
//     plugins: [
//         // 自动清理 dist 文件夹
//         new CleanWebpackPlugin({
//             cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, '../dist')],
//             verbose: true, //开启在控制台输出信息
//             dry: false,
//             dangerouslyAllowCleanPatternsOutsideProject: true, // 输出文件前清理干净
//         }),
//         // new VueLoaderPlugin(),
//         // new CopyWebpackPlugin([{
//         //     from: path.resolve(__dirname, './public'),
//         //     to: path.resolve(__dirname, './dist'),
//         //     ignore: ['*.html']
//         // }, ]),
//         // new HTMLWebpackPlugin({
//         //     title: 'itools-plugin', // 生成的html页面的标题
//         //     filename: 'index.html', // 生成到dist目录下的html文件名称，支持多级目录（eg: `${item.page}/index.html`）
//         //     template: path.resolve(__dirname, '../public/index.html'), // 模板文件，不同入口可以根据需要设置不同模板
//         //     chunks: ['index', 'vendor', 'common'], // html文件中需要要引入的js模块，这里的 vendor 是webpack默认配置下抽离的公共模块的名称
//         //     dateTime: (new Date()).getTime(),
//         // }), // 利用 HTMLWebpackPlugin 插件合成最终页面
//         new MiniCssExtractPlugin({
//             filename: 'css/[name].css'
//         }),
//         new webpack.DefinePlugin({
//             'process.env': {
//                 'NODE_ENV': JSON.stringify('production'),
//             },
//         }),
//         new webpack.optimize.OccurrenceOrderPlugin(true),
//         new MinifyPlugin(),
//     ]
// };
