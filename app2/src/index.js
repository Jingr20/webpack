// 调用app1中的模块
import ('appone/Sitename').then(res => {
    // 该模块res暴露的函数res.default()，返回值是一个元素
    // const title = res.default('应用B');

    // 该模块res的sitename函数
    const title = res.sitename('应用B');
    document.body.append(title);
});