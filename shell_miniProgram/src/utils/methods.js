/*
 * @Author: yezunfa
 * @Date: 2020-08-02 17:05:03
 * @LastEditTime: 2020-08-02 17:05:35
 * @Description: Do not edit
 */ 
//包括函数相关的一系例操作方法

/**
 * 函数节流
 * 一般用于短时间频繁触发的事件 如 onScroll
 * @param {Function} func 要进行节流的函数,不能为箭头函数(必填)
 * @param {Number} delay 节流时间间隔 默认 1000ms
 * @param {Object} ctx 节流函数执行上下文(传this指针) 默认 当前执行环境 this
 */

exports.throttle = function(func, delay, ctx) {
    if (!func || !func.prototype) throw new Error('first param must be function type');
    let timmer = null;
    return function(...args) {
        if (!timmer) {
            const _ctx = ctx || this;
            timmer = setTimeout(() => {
                func.apply(_ctx, args);
                timmer = null;
            }, delay || 1000);
        }
    }
}

/**
 * 函数防抖
 * 一般用于事件多次触发，只执行一次的情况
 * @param {Function} func 要进行节流的函数，不能为箭头函数（必填）
 * @param {Number} delay 节流时间间隔 默认 1000ms
 * @param {Object} ctx 节流函数执行上下文 默认当前执行环境 this
 * 
 */
exports.debounce = function(func, delay, ctx) {
    if (!func || !func.prototype) throw new Error('first param must be function type');
    let timmer = null;
    return function(...args) {
        const _ctx = ctx || this;
        clearTimeout(timmer);
        timmer = setTimeout(() => {
            func.apply(_ctx, args);
        }, delay || 1000);
    }
}

/**
 * 生成唯一短id(依赖时间戳,待优化)
 */
exports.Dom_id = function(name) {
    let string = ''
    let str = `${new Date().getTime()}`
    let result = str.substring(str.length - 6).split('')
    for (let i = 0; i < 6; i++) {
        let num = Math.ceil(Math.random() * 57)
        let isnum = Boolean(Math.round(Math.random()))
        string += isnum ? (num < 10 ? num : result[i]) : String.fromCharCode(65 + num)
    }
    string = `${name || ''}_${string}`
    return string
}

/**
 * 生成唯一短id(依赖时间戳)
 */
exports.shortid = function(name) {
    return `id_${Number(Math.random().toString().substr(3,6) + Date.now()).toString(36)}`
}

/**
 * 压缩uuid
 */
exports.uuid_compression = function(id) {
    return id.split('-').join('')
}
/**
 * 解除压缩
 * todo 待优化
 */
exports.uuid_decompression = function(id) {
    let array_1 = ''
    let array_2 = ''
    let array_3 = ''
    let array_4 = ''
    let array_5 = ''
    let array = id.split('')
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (index < 8) {
            array_1 += element
        } else if (index < 12) {
            array_2 += element
        } else if (index < 16) {
            array_3 += element
        } else if (index < 20) {
            array_4 += element
        } else {
            array_5 += element
        }
    }
    return `${array_1}-${array_2}-${array_3}-${array_4}-${array_5}`
}

/**
 * 处理表单接口(新)
 * @param {*} api 接口路由
 * @param {*} params 接口参数
 */
exports.MangoTableApi = (api, params = {}) => {
    const { current, pageSize, total, order, ...querys } = params;
    try {
        if (order && !(order instanceof Array)) throw new Error(`"order" have to be Array`);
        if (current && !(current >= 1)) throw new Error(`"current" have to be greater than zero`);
        if (pageSize && !(pageSize >= 1)) throw new Error(`"pageSize" have to be Array`);
    } catch (error) {
        console.error(error);
    }

    const pagination = {};
    pagination.disabled = true;
    pagination.current = current;
    pagination.pageSize = pageSize;
    if (current && pageSize) pagination.disabled = false;

    const conditions = {};
    try {
        conditions.pagination = JSON.stringify(pagination);
        if (querys) conditions.query = JSON.stringify(querys);
        if (order && order.length) conditions.sort = JSON.stringify(order.map(({ key, by }) => [key, by]));
    } catch (error) {
        console.error(error)
    }
    

    return `${api}?${JSON.stringify(conditions)}`;
};

exports.GenerateUUID = (len, radix) =>{ 
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
     
        if (len) {
          // Compact form
          for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
          // rfc4122, version 4 form
          var r;
     
          // f107511e-feeb-4264-9589-16e21f8b2b9e
          // rfc4122 requires these characters
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';
     
          // Fill in random data.  At i==19 set the high bits of clock sequence as
          // per rfc4122, sec. 4.1.5
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random()*16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }
     
        return uuid.join(''); 
}