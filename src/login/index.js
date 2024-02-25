import './index.less'
// 使用绝对路径别名@
import { checkPwdLength, add } from '@/utils/check'

import axios from 'axios'

console.log('校验密码长度：' + checkPwdLength('12345'));
const result = add(2, +new Date())
console.log(result);

console.log('登录页：' + axios);