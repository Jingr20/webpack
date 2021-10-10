const marked = require('marked');
const {getOptions} = require('loader-utils');


// loader本质是一个ES module模块，它导出一个函数，在函数中对打包资源进行转换
// 导出函数时建议使用普通函数，而不使用箭头函数（拿不到配置项）
module.exports = function(source){
    // 获取loader的配置项
    const options = getOptions(this);
    console.log('myLoader的配置项',options);

    const html = marked(source);

    // 返回必须是一段JS代码
    // return "console.log('编译时输出my loader')"

    // "<h1 id="readme">readme</h1><p>webpack之自定义loader学习</p>"
    // 直接返回，可能因为引号的问题报错
    // return `module.export = "${html}"`
    // return `module.export = ${JSON.stringify(html)}`

    // 直接返回html，交给下一个loader处理
    return html;
}