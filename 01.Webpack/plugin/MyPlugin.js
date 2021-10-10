const { Compilation } = require("webpack");

// 声明自定义插件
class MyPlugin{
    constructor(options){
        console.log('插件配置选项',options);
        this.userOptions = options || {};
    }
    // 必须声明apply方法
    apply(compiler){
        // 在钩子上挂载功能
        compiler.hooks.emit.tap('MyPlugin',compilation => {
            // compilation此次打包的上下文
            for(const name in compilation.assets){
                console.log(name);
                // 针对CSS文件做一些操作：删除注释
                if(name.endsWith(this.userOptions.target)){
                    // 获取处理之前的内容
                    const contents = compilation.assets[name].source();
                    // 将原来的内容通过正则表达式，删除注释
                    const nocommments =  contents.replace(/\/\*[\s\S]*?\*\//g,'');
                    // 将处理后的结果，替换掉
                    compilation.assets[name] = {
                        source:() => nocommments,
                        size:() => nocommments.length
                    }
                }
            }
        });
    }
}

module.exports = MyPlugin;
