const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Mfp = require('webpack').container.ModuleFederationPlugin;


module.exports = {
    mode:'development',
    entry:'./src/index.js',
    output:{
        path:resolve(__dirname,'dist'),
        filename:'bundle.js'
    },
    module:{
        rules:[

        ]
    },
    devServer:{
        contentBase:resolve(__dirname,'dist'),
        port:3002
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./src/index.html'
        }),
        new Mfp({
            remotes:{
                // 导入别名：“远程应用名称@远程应用地址/远程导出文件名称”
                appone:"app1@http://localhost:3001/app1.js"
            }
        })
    ]
};