const path = require('path');
const webpackBase = require('./webpack.base.js');
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(webpackBase, {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'postcss-loader',
                ]
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
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
            {
                test: /\.(js|vue)$/,
                enforce: 'pre', // 强制先进行 ESLint 检查
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    // 启用自动修复
                    fix: true,
                    // 启用警告信息
                    emitWarning: true,
                }
            },
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        // historyApiFallback: {
        //     rewrites: {},
        // },
        disableHostCheck: true,
        overlay: {
            errors: true,
            warnings: true,
        },
        open: true, // 服务启动后 打开浏览器
        proxy: { // 本地接口代理转发
            // '/api/sh/v1': {
            //     target: 'http://10.0.244.37:8080',//目标接口域名
            //     changeOrigin: true,//是否跨域
            // },
        },
    },
});
