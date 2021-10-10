// 开发环境配置文件

const {merge} = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const devWebpackConfig = merge(baseWebpackConfig,{
    // 开发模式对应的配置
    mode:'development',
    plugins:[
        // 为配置注入全局变量
        new webpack.DefinePlugin({
            // 开发环境下的接口地址
            // 变量后面的值，是一段代码片段
            API_BASE_URL:JSON.stringify('http://apidev.example.com')
        }),

        // ******************** 打包HTML
        // 1.配置【打包html】插件
        new HtmlWebpackPlugin({
            // 指定打包后的html文件名称,默认在dist文件夹下（根据出口配置）
            filename:'index.html',
            // 指定生成html的模版文件，默认在项目根目录下
            template:'src/index.html',
            // 指定html中使用的变量
            title:"Webpack Demo"
        }),
        // 打包多个，每个实例对应一个html文件
        new HtmlWebpackPlugin({
            // 指定打包后的html文件名称,默认在dist文件夹下（根据出口配置）
            filename:'about.html',
            // 指定生成html的模版文件，默认在项目根目录下
            template:'src/index.html',
            // 指定html中使用的变量
            title:"about us"
        })
    ]
});

module.exports = devWebpackConfig;