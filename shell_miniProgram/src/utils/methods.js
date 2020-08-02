// 包括函数相关的一系列操作方法

/**
 * 处理表单接口
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
    conditions.pagination = JSON.stringify(pagination);
    if (querys) conditions.query = JSON.stringify(querys);
    if (order && order.length)
        conditions.sort = JSON.stringify(order.map(({ key, by }) => [key, by]));

    return `${api}?${stringify(conditions)}`;
};

/**
 * 函数节流 
 * 一般用于短时间频繁触发的事件 如 onScroll
 * @param {Function} func 要进行节流的函数，不能为箭头函数(必填)
 * @param {Number} delay 节流时间间隔  默认 1000ms
 * @param {Object} ctx  节流函数执行上下文(传this指针)  默认 当前执行环境 this 
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
 * @param {Function} func 要进行节流的函数，不能为箭头函数(必填)
 * @param {Number} delay 节流时间间隔  默认 1000ms
 * @param {Object} ctx  节流函数执行上下文  默认 当前执行环境 this 
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
 * 生成唯一短id(依赖时间戳)
 */
exports.shortid = function(name) {
    return `${name || "id"}_${Number(Math.random().toString().substr(3,6) + Date.now()).toString(36)}`
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
    if (!id) return false
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
 * 获取路由中的参数
 */
exports.resolveURL = function(path) {
    const group = path.split('?')
    const params = {}
    group[1].split("&").forEach(element => {
        const key = element.split("=")[0]
        const value = element.split("=")[1]
        params[key] = value
    });
    return {
        url: group[0],
        params
    }
}