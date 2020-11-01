/*
 * @Author: yezunfa
 * @Date: 2020-03-28 19:05:39
 * @LastEditTime: 2020-10-28 15:28:01
 * @Description: Do not edit
 */ 
import Taro from '@tarojs/taro'
import { USER_LOGIN } from '@constants/api'
import fetch from '@utils/request'
import { retryLogin } from '@utils/methods'
// import store from '../store'

/**
 * weapp login request
 * todo : openid 有可能取不到 
 * @param {*} userdata update data with userdata that define
 */
exports.Login = async () => {
    try {
        const loginInfo = await Taro.login({ timeout: 4000 })
        const { code, errMsg } = loginInfo
        
        if (errMsg !== 'login:ok') throw new Error(errMsg)
        const params = { Login: false }
        params.method = 'POST'
        params.showToast = false
        params.pureReturn = true
        params.url = USER_LOGIN
        params.payload = { LoginCode: code } 
        
        const response = await fetch(params)
        return response
    } catch (error) {
        throw error
    }
}


/**
 * 获取用户信息
 */
exports.getUserInfo = async () => {
    try {
        const $scope = await Taro.getSetting()
        const { authSetting } = $scope
        let result = {}
        if (!authSetting["scope.userInfo"]) await Taro.authorize({ scope: 'scope.userInfo' })
        let loginresult = await Taro.login({ timeout: 2000 })
        console.log(loginresult)
        await Taro.checkSession({
            success: function(res) {
                console.log("处于登录态");
                const { code } = loginresult
                const userInfo =  Taro.getUserInfo()
                result = { ...userInfo, code }

            },
            fail: function(res) {
                console.log("需要重新登录");
                result = retryLogin()
            }
        })
        console.log(result)
        return result
    } catch (error) {
        console.error("getuserInfo error")
        throw error
    }
}

   