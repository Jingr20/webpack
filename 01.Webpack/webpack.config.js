/**
* Webpack的配置文件
*/

const {resolve} = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESlintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const MyPlugin = require('./plugin/MyPlugin');

module.exports = (env,argv) => {
    const config = {
        // 打包模式
        mode:'development',
        // mode:'production',
        // 入口文件
        // entry:'./src/index.js',
        entry:{
            'index':'./src/index.js',
            'about':'./src/about.js'
        },
        // 出口配置
        output:{
            // 输出目录（输出目录必须是绝对路径）
            path:resolve(__dirname,'dist'),
            // 输出文件名字
            // filename:'main.js'
            // 多个入口文件时，名字不应该写死
            // filename:'[name].bundle.js'
            // 同一文件名字固定时，有缓存的话文件不会更新到最新
            filename:'[name].[chunkhash].js'
        },
        // 源码映射
        devtool:'source-map',

        // 模块的解析规则
        resolve:{
            alias:{
                // 配置模块加载路径的别名
                '@':resolve('src') 
            },
            extensions:['.js','.json','.css'],
            // 指定模块默认的加载路径
            modules:[resolve(__dirname,'./node_modules'),'node_modules']
        },

        // 排除打包依赖项
        externals:{
            'jquery':'jQuery'
        },

        // 优化策略
        optimization:{
            // 开启副作用
            sideEffects:true,

            // 标记未被使用的代码
            usedExports:true,
            // 删除usedExports标记的未使用的代码
            // 会压缩
            // minimize:true,
            // minimizer:[new TerserPlugin()],

            // 提取公共模块
            splitChunks:{
                chunks:'all'
            }
        },

        // 模块配置
        module:{
            rules:[
                // 指定多个配置规则，各模块使用的loader
                // 1.针对CSS文件的规则
                {
                    test:/\.css$/i,
                    use:[
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
                    ]
                },
                // 2.针对less文件的规则
                {
                    test:/\.less$/i,
                    use:[
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'less-loader'
                    ],
                },
                // 3.针对JS文件的规则
                {
                    test: /\.m?js$/, 
                    exclude: /node_modules/,
                    // use:'babel-loader'
                    use:[
                        {
                            loader: 'babel-loader',
                            options: {
                                // 第二次构建时，会读取之前的缓存
                                cacheDirectory: true
                            }
                        }
                    ]
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
                },

                // 自定义loader对markdown文件进行解析
                {
                    test:/\.md$/i,
                    // use:'./loader/markdown-loader.js'
                    use:[
                        'html-loader',
                        {
                            // 相当于这个对象调用loader里导出的函数
                            loader:'./loader/markdown-loader.js',
                            options:{
                               size:20
                            }
                        }
                    ]
                }
            ]
        },
        // 插件配置
        plugins:[
            // ******************** 打包CSS
            // 1.配置【打包独立CSS文件】插件，可以指定输出目录、文件名等
            new MiniCssExtractPlugin({
                // 根据出口配置，默认已经在dist文件夹下，设置输出文件名称
                filename:'css/[name].[chunkhash].css'
            }),
            // 2.配置【CSS格式校验】插件，可以指定校验文件等
            new StylelintPlugin({
                // 指定校验文件,默认在项目根目录下
                files:['src/css/*.{css,less,sass,scss}']
            }),

            // ******************** 打包HTML
            // 1.配置【打包html】插件
            new HtmlWebpackPlugin({
                // 指定打包后的html文件名称,默认在dist文件夹下（根据出口配置）
                filename:'index.html',
                // 指定生成html的模版文件，默认在项目根目录下
                template:'src/index.html',
                // 指定html中使用的变量
                title:"Webpack Demo",
                chunks:['index']
            }),
            // 打包多个，每个实例对应一个html文件
            new HtmlWebpackPlugin({
                // 指定打包后的html文件名称,默认在dist文件夹下（根据出口配置）
                filename:'about.html',
                // 指定生成html的模版文件，默认在项目根目录下
                template:'src/index.html',
                // 指定html中使用的变量
                title:"about us",
                chunks:['about']
            }),
            // ******************** 打包JS
            // 1.配置【JS格式校验】插件
            // new ESlintPlugin({
            //     // 自动解决常规的代码格式报错
            //     fix:true
            // }),

            new CleanWebpackPlugin(),

            // 自定义插件
            new MyPlugin({
                target: '.css'
            })
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

    if(env.production){
        config.mode = 'production',
        // 启用source map定位问题
        config.devtool = 'source-map',
        // 生产环境进行压缩
        config.plugins = [
            // ******************** 打包CSS
            // 1.配置【打包独立CSS文件】插件，可以指定输出目录、文件名等
            new MiniCssExtractPlugin({
                // 根据出口配置，默认已经在dist文件夹下，设置输出文件名称
                filename:'css/[name].[hash].css'
            }),
            // 2.配置【CSS格式校验】插件，可以指定校验文件等
            new StylelintPlugin({
                // 指定校验文件,默认在项目根目录下
                files:['src/css/*.{css,less,sass,scss}']
            }),
            // 3.配置【压缩CSS】插件
            new OptimizeCssAssetsPlugin(),
    
            // ******************** 打包HTML
            // 1.配置【打包html】插件
            new HtmlWebpackPlugin({
                // 指定打包后的html文件名称,默认在dist文件夹下（根据出口配置）
                filename:'index.html',
                // 指定生成html的模版文件，默认在项目根目录下
                template:'src/index.html',
                // 指定html中使用的变量
                title:"Webpack Demo",
                minify:{
                    collapseWhitespace: true,
                    keepClosingSlash: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                  }
            }),
            // 打包多个，每个实例对应一个html文件
            new HtmlWebpackPlugin({
                // 指定打包后的html文件名称,默认在dist文件夹下（根据出口配置）
                filename:'about.html',
                // 指定生成html的模版文件，默认在项目根目录下
                template:'src/index.html',
                // 指定html中使用的变量
                title:"about us",
                minify:{
                    collapseWhitespace: true,
                    keepClosingSlash: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                  }
            }),
            // ******************** 打包JS
            // 1.配置【JS格式校验】插件
            // new ESlintPlugin({
            //     // 自动解决常规的代码格式报错
            //     fix:true
            // }),

            new CleanWebpackPlugin()
        ]
    }

    return config;
}