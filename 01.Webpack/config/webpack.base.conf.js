/**
* Webpack的配置文件
*/

const {resolve} = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ESlintPlugin = require('eslint-webpack-plugin');

const commonCSSLoader = [
    // 执行顺序；先下后上
    // 'style-loader',

    // 若想打包成独立的CSS文件，用mini-css-extract-plugin替换style-loader
    // css代码被抽成一个独立的文件，需要单独引入
    // MiniCssExtractPlugin.loader,
    {
        loader:MiniCssExtractPlugin.loader,
        options:{
            // 打包后的CSS文件存储在dist/css/main.css，结合CSS和图片打包后的输出位置，为背景图片设置正确路径
            // publicPath:'../images/'   // 为背景图片指定路径
        }
    },
    'css-loader',
    // 将css打包转化成js之前，应添加前缀适配不同的浏览器
    'postcss-loader'
];

module.exports = {
    // 入口文件
    entry:'./src/index.js',
    // 出口配置
    output:{
        // 输出目录（输出目录必须是绝对路径）
        path:resolve(__dirname,'../dist'),
        // 输出文件名字
        filename:'main.js'
    },
    // 模块配置
    module:{
        rules:[
            // 指定多个配置规则，各模块使用的loader
            // 1.针对CSS文件的规则
            {
                test:/\.css$/i,
                use:commonCSSLoader
            },
            // 2.针对less文件的规则
            {
                test:/\.less$/i,
                use:[
                    ...commonCSSLoader,
                    'less-loader'
                ],
            },
            // 3.针对JS文件的规则
            {
                test: /\.m?js$/, 
                exclude: /node_modules/,
                use:'babel-loader'
            },
            // 4.针对图片image的规则
            {
                test:/\.(png|gif|jpeg|jpg)$/i,
                // use:{
                //     loader:'url-loader',
                //     options:{
                //         // 指定图片大小，小于该数值的图片，会被转成base64
                //         limit:8*1024,  // 8kb
                //         // 默认输出到dist文件夹下，直接用hash命名;此时指定输出到dist/images/下
                //         name:"images/[name].[ext]",
                //         // url-loader默认采用ES Module规范进行解析，但是html-loader引入图片使用的是CommonJS规范
                //         esModule:false
                //     }
                // }

                // webpack5中使用资源模块处理
                type:'asset',
                parser:{
                    dataUrlCondition:{
                        maxSize:8*1024
                    }
                },
                generator:{
                    filename:'images/[name][ext]'
                }
            },
            // 对于直接写在html文件中的图片
            // {
            //     test:/\.(html|htm)$/i,
            //     use:{
            //         loader:'html-loader',
            //         options:{
            //             // Webpack4中只需要在url-loader中配置esModule:false
            //             // Webpack5中需要在html-loader中，也配置esModule:false
            //             esModule:false
            //         }
            //     }
            // },
            // 5.针对front的规则
            {
                test:/\.(eot|svg|ttf|woff|woff2)$/i,
                // （1）webpack4中使用loader处理
                // use:{
                //     loader:'file-loader',
                //     options:{
                //         name:"fronts/[name].[ext]"
                //     }
                // }

                // （2）webpack5中使用资源模块处理字体、图片文件
                // asset可以在asset/resource 和 asset/inline 之间进行选择
                // 如果文件小于8kb，则使用asset/inline类型
                // 如果文件大于8kb，则使用asset/resource类型
                type:'asset',
                parser:{
                    dataUrlCondition:{
                        maxSize:8*1024
                    }
                },
                generator:{
                    filename:'fronts/[name][ext]'
                }
            }
        ]
    },
    // 插件配置
    plugins:[
        // ******************** 打包CSS
        // 1.配置【打包独立CSS文件】插件，可以指定输出目录、文件名等
        new MiniCssExtractPlugin({
            // 根据出口配置，默认已经在dist文件夹下，设置输出文件名称
            filename:'css/main.css'
        }),
        // 2.配置【CSS格式校验】插件，可以指定校验文件等
        new StylelintPlugin({
            // 指定校验文件,默认在项目根目录下
            files:['src/css/*.{css,less,sass,scss}']
        }),
        // ******************** 打包JS
        // 1.配置【JS格式校验】插件
        // new ESlintPlugin({
        //     // 自动解决常规的代码格式报错
        //     fix:true
        // })

    ],
    // 开发服务器
    devServer:{
        // 指定加载内容的路径
        contentBase:resolve(__dirname,'dist'),
        // 启用gzip压缩
        compress:true,
        // 端口号
        port:9000,
        // 启动自动更新（禁用hot）
        inline : true,

        // 配置代理，解决接口跨域问题
        proxy:{
            // 接口的请求路径
            // 相当于 http://localhost:9000/api
            '/api':{
                // 配置访问api时应该指向的内容
                // http://localhost:9000 => https://api.github.com
                // http://localhost:9000/api/users => https://api.github.com/api/users
                target:'https://api.github.com',
                // 上述接口路径多了一个api,需进行路径的映射
                // http://localhost:9000/api/users => https://api.github.com/users
                pathRewrite:{
                    '^/api':""
                },
                // 不能使用localhost:9000作为GitHub的主机名，改变域名
                changeOrigin:true
            }
        }
    },
    // 配置目标
    target:'web'
}