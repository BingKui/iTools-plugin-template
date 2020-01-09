const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        index: path.resolve(__dirname, '../src/index.js'),
    },
    output: {
        publicPath: './',
        filename: 'js/[name].js',
        path: path.resolve(__dirname, '../dist'),
        chunkFilename: '[id].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/, // 处理vue模块
                use: [{
                    loader: 'vue-loader',
                }],
            },
            {
                test: /\.js$/, //处理es6语法
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: ['@babel/preset-env'],
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/, // 处理图片
                use: {
                    loader: 'file-loader', // 解决打包css文件中图片路径无法解析的问题
                    options: {
                        // 打包生成图片的名字
                        name: '[name].[ext]',
                        // 图片的生成路径
                        outputPath: 'img',
                        publicPath: 'img',
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/, // 处理字体
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'font',
                    }
                }
            },
        ],
    },
    resolve: { // 设置模块如何被解析
        alias: {
            '@assets': path.resolve(__dirname, '../src/assets'),
            '@biz': path.resolve(__dirname, '../src/biz'),
            '@common': path.resolve(__dirname, '../src/common'),
            '@components': path.resolve(__dirname, '../src/components'),
            '@constants': path.resolve(__dirname, '../src/constants'),
            '@mixins': path.resolve(__dirname, '../src/mixins'),
            '@router': path.resolve(__dirname, '../src/router'),
            '@mock': path.resolve(__dirname, '../src/mock'),
            '@store': path.resolve(__dirname, '../src/store'),
            '@styles': path.resolve(__dirname, '../src/styles'),
            '@views': path.resolve(__dirname, '../src/views'),
        },
        extensions: ['*', '.less', '.css', '.js', '.vue']
    },
    plugins: [
        new VueLoaderPlugin(),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../public'),
            to: path.resolve(__dirname, '../dist'),
            ignore: ['*.html']
        }, ]),
        new HTMLWebpackPlugin({
            title: 'itools-plugin', // 生成的html页面的标题
            filename: 'index.html', // 生成到dist目录下的html文件名称，支持多级目录（eg: `${item.page}/index.html`）
            template: path.resolve(__dirname, '../public/index.html'), // 模板文件，不同入口可以根据需要设置不同模板
            chunks: ['index', 'vendor', 'common'], // html文件中需要要引入的js模块，这里的 vendor 是webpack默认配置下抽离的公共模块的名称
            dateTime: (new Date()).getTime(),
        }), // 利用 HTMLWebpackPlugin 插件合成最终页面
    ]
};
