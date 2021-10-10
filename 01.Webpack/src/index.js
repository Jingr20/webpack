/**
 * webpack打包入口文件
 */
import $ from 'jquery';
// import './css/main.css';
import './css/main';

// 以模块的方式引入图片
import person from './images/person.jpeg';

import {add} from '@/math';
console.log(add(2,4));

import './extend';
console.log((7).pad(7));

// 引入markdown文件
import readme from './readme.md';

// eslint-disable-next-line
console.log('hello webpack');

const showMsg = () => {
  // eslint-disable-next-line
  alert('箭头函数');
};

// eslint-disable-next-line
window.showMsg = showMsg;

// babel只能针对基本语法进行转化，对于一些高级语法是没办法进行转换的，比如promise
// @babel/polyfill，可以转译所有的JS新语法
const p = new Promise((resolve) => {
  setTimeout(() => {
    // eslint-disable-next-line
    console.log('Promise is working');
    resolve();
  }, 2000);
});
// eslint-disable-next-line
console.log(p);

// eslint-disable-next-line
const img = new Image();
img.src = person;
// eslint-disable-next-line
document.body.appendChild(img);

// eslint-disable-next-line
// 注意这个是在config文件夹下配置文件中定义的全局变量
// console.log('接口地址：', API_BASE_URL);

// eslint-disable-next-line
console.log('markdown-loader测试', readme);

// 给body添加一个页脚（包含备案号）
$('body').append('<h3>备案号：XXXXX</h3>');

// 懒加载
document.getElementById('btn').onclick = function(){
  // import 启动懒加载
  // webpackChunkName:'desc' 指定懒加载的文件名称
  // webpackPrefetch:true 启动预加载
  import(/*webpackChunkName:'desc',webpackPrefetch:true*/'./wb').then(({desc}) => {
    alert(desc());
  });
}

