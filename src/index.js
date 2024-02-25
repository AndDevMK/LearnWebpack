// 使用绝对路径别名@
import { checkPwdLength, add } from '@/utils/check'
import './index.less'
import icon_finish from './assets/icon_finish.png'
import axios from 'axios'

// 如果是生产环境，让console.log等于一个空函数即可
// if (process.env.NODE_ENV === 'production') {
//     console.log = function () { }
// }

const iconObj = document.createElement('img')
iconObj.src = icon_finish
document.querySelector('.some-img').appendChild(iconObj)

console.log('校验密码长度：' + checkPwdLength('123456789'));
const result = add(2, +new Date())
console.log(result);

console.log('首页：' + axios);

// 错误演示
// consolee.log('hello webpack')

document.querySelector('.btn-login').addEventListener('click', function (e) {
    location.href = './login/index.html'
})
