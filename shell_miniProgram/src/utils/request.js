/*
 * @Author: yezunfa
 * @Date: 2019-07-22 16:56:19
 * @LastEditTime: 2020-07-04 17:50:22
 * @Description: Do not edit
 */ 

import Taro from '@tarojs/taro'
import { getStore } from '@tarojs/redux'
import { system_code } from '@constants/enums'
import { Login, getUserInfoFromLocalStorerage } from '@utils/user'

const USER_STORE_KEY = 'user_local_store'

// 简易封装数据缓存使其支持 async awaiy
function getStorage(key) {
    return Taro.getStorage({ key }).then(res => res.data).catch(() => '')
}
// 简易封装接口 todo: 从session 取
function parseUrl(url, userid) {
    let url_login = ''
    if (!userid) url_login = url
    else if (url.indexOf('?') === -1) url_login = `${url}?userid=${userid}`
    else url_login = `${url}&userid=${userid}`
    return url_login
}

const handleCode = (code, response) => {
    const { message } = response.data
    const defaultMsg = {}
    defaultMsg[600] = "登录信息失效"
    throw new Error(message || defaultMsg[code] || "网络异常")
}

/**
 * 简易封装fetch请求
 * // NOTE Login默认为true ---- 默认发送 userid 作为 query
 * // NOTE 需要注意 RN 不支持 *StorageSync，此处用 async/await 解决
 * // NOTE 直接返回data
 * @param {Object} options
 * @param {String} options.url 请求的地址 
 * @param {String} options.method 请求的类型
 * @param {*} options.payload 请求的数据
 * @param {Boolean} options.showToast 是否出现弹层
 * @param {Boolean} options.Login 是否需要用户登录
 * @param {String} options.dataType 数据类型
 * @param {Object} options.query 查询条件 // TODO
 * @param {Object} options.pureReturn // 直接返回接口数据
 */
export default async function fetch(options) {
    const errmsg = "网络异常, 请刷新重试"
    const { url, payload, method = 'GET', showToast = true, Login = false, dataType = 'json' } = options

    // const token = await getStorage('token')
    // const csrf = await getStorage('csrf')

    const header = {}
    // header = token ? { 'WX-PIN-SESSION': token, 'X-WX-3RD-Session': token } : {}
    // header['Cookie'] = token ? 'wechat_token=' + token : ''
    // header['CSRF-TOKEN'] = csrf ? csrf : ''
    if (method === 'POST') header['Content-Type'] = 'application/x-www-form-urlencoded'

    const { userinfo } = getStore().getState().global

    try {

        const params = { method, header, dataType }
        params.data = payload
        params.body = payload
        params.url = parseUrl(`${url}?`, userinfo.Id)
        const response = await Taro.request(params)

        const { code, data } = response.data

        if (code !== system_code.success) return handleCode(code, response)

        if (options && options.pureReturn) return response.data;

        return data

    } catch (error) {
        console.log(url)
        console.error(error)
        // 使用promise抛出异常
        if (!showToast) return Promise.reject({ message: title, ...error })

        const icon = 'none'
        const title = error.message || errmsg
        Taro.showToast({ title, icon })
        return Promise.reject({ message: title, ...error })
    }
}
