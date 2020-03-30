import Taro from '@tarojs/taro'
import { USER_LOGIN } from '@constants/api'
import fetch from '@utils/request'
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
        // 当前获取用户信息方法被官方弃用，只能使用button
        if (!authSetting["scope.userInfo"]) await Taro.authorize({scope: 'scope.userInfo'})
        
        const { code } = await Taro.login({ timeout: 2000 })
        const userInfo = await Taro.getUserInfo()

        return { ...userInfo, code }
    } catch (error) {
        console.error("asdghkasd")
        throw error
    }
}