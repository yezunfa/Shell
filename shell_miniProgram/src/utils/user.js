import Taro from '@tarojs/taro'
import { USER_LOGIN, SAVE_USER_INFO } from '@constants/api'
import fetch from '@utils/request'

const CODE_KEY = "WX_LOGIN_CODE";           // 临时凭证:通过wx.login来获得，应写入缓存中
const SESSOIN_KEY = "authtoken";            // 与服务器会话的session_key，需要将临时凭证发往微信那边的服务器来获取
const USER_STORE_KEY = 'user_local_store'   // 用户信息

// 获取微信登录凭证
export const wxLogin = async () => {
    try {
        const res = await Taro.login({ timeout: 4000 });
        if(res && res.code) {
            Taro.setStorageSync(CODE_KEY,res.code);
            return res.code;
        } else {
            console.log('微信login获取临时凭着失败')
            Taro.showToast('微信login获取临时凭着失败,请重试');
        }
    } catch (error) {
        console.log('微信获取临时凭着失败', error)
        Taro.showToast('微信获取临时凭着失败,请重试');
    }
}

/**
 * 判断Session是否失效
 */
export const checkSession = async () => {
    return new Promise((resolve, reject) => {
        Taro.checkSession({
            success: function() {
                console.log("session_key 未过期")
                //session_key 未过期，并且在本生命周期一直有效
                if (!Taro.getStorageSync(CODE_KEY)) {
                    Taro.showToast({ title: '本地没有缓存token' , icon: 'none'})
                    // throw 
                }
                resolve(Taro.getStorageSync(CODE_KEY))
            },
            fail: function() {
               resolve(false);
            }
        }).catch(ex => {
            reject(ex)
        })
    })
}

export const getWxCode = async () => {
    const isExistSession = await checkSession();
    if(!isExistSession) {
        await Login();
    }
    return Taro.getStorageSync(CODE_KEY)
}

export const getAuthSessionKey = async (storageOnly) => {
    if(!storageOnly) {
        const isExistSession = await checkSession();
        if(!isExistSession) {
            await Login();
        }
    }
   
    const temp = {};
    temp[SESSOIN_KEY] = Taro.getStorageSync(SESSOIN_KEY);
    // {
    //    auth_key: 'xxxxxx'
    // }
    return {
        ...temp
    }
}

/*
* 参考：https://www.jianshu.com/p/c2e712609c7b 基于Taro框架的微信小程序JWT授权登录方案
    1. 进入小程序，先调用Login，
*/ 
export const Login = async (options) => {
    const isExistSession = await checkSession();
    console.log(isExistSession, 'isExistSession')
    // 不存在，则登录
    if((options && options.forceLogin) || !isExistSession) {
        // 这个code 可重用？
        const code = await wxLogin();
        const res = await Taro.request({
            url: USER_LOGIN ,
            method: 'POST',
            data: {
                LoginCode: code
            }
        }).catch(ex => {
            console.log(ex)
            Taro.showToast('登录网络不稳定，请重试');
            return;
        })

        // if(res && res.data && res.data.success &&  res.data.data[SESSOIN_KEY]) {
        //     //清除缓存
        //     //  Taro.clearStorageSync() ??
        //     Taro.setStorageSync(SESSOIN_KEY,res.data.data[SESSOIN_KEY])

        //     // 保存到本地
        //     saveUserInfoToLocalStorerage(res.data.data.userinfo);
        //     return res.data.data.userinfo;
        // } else {
        //     console.log(res)
        //     Taro.showToast('登录网络繁忙，请重试');
        //     return false;
        // }

        if(res && res.data && res.data.success) {
            // 保存toke(session_key到缓存中)
            Taro.setStorageSync(SESSOIN_KEY,res.data.data[SESSOIN_KEY])

            // 保存用户信息到本地
            saveUserInfoToLocalStorerage(res.data.data.userinfo);
            return res.data.data.userinfo;
        } else {
            console.log(res)
            Taro.showToast('登录网络繁忙，请重试');
            return false;
        }
    } 
}

/**
 * 从本地获取获取用户信息
 */
export const getUserInfoFromLocalStorerage = async () => {
    return Taro.getStorageSync(USER_STORE_KEY)
}

/**
 * 保存用户
 * @param {Object} userData 
 */
const saveUserInfoToLocalStorerage = (userData) => {
    return Taro.setStorageSync(USER_STORE_KEY,userData )
}

/**
 * 判断用户微信信息是否已经更新过了
 * @param {Object} data 
 */
const checkUserInfoHadChange = (data) => {
    const localUserInfo = getUserInfoFromLocalStorerage();
    console.log(localUserInfo, 'localUserInfo')
    if(!localUserInfo) {
        return true;
    }
    const { avatarUrl: Avatar , city: City, country: Country, gender: Sex, province: Province,  nickName: NickName} = data
 
    const userData  = {
        Avatar,
        NickName,
        City,
        Country,
        Sex: Sex +'', // db is varchar '1'
        Province,
    }

    for(var filed in userData) {
        if(userData[filed] !== localUserInfo[filed]) {
            return true;
        }
    }
    return false;
}

/**
 * 获取用户信息按钮处理方式
 * @param {*} e 
 * @param {*} callback 
 */
export const handleGetUserInfo = async (e, callback, options) => {
    const { message } = options || { message : '需要您的授权才能进行下一步' };
    if (e.target.errMsg !== 'getUserInfo:ok') return Taro.showToast({ title: message, icon: 'none' })
    const data = e.target.userInfo;
   
    if(checkUserInfoHadChange(data)) {
        const response = await fetch({
            url: SAVE_USER_INFO ,
            method: 'POST',
            payload: data
        }).catch(ex => {
            console.log(ex)
            Taro.showToast({
                title: '登录网络不稳定，请重试',
                icon: 'none',
                duration: 200
            })
            return;
        });

        if(response && response.data && response.data.success && response.data.data) {
            saveUserInfoToLocalStorerage(response.data.data)
        } else {
            
            Taro.showToast({
                title: '网络繁忙，请重试',
                icon: 'none',
                duration: 200
            })
            return;
        }
    }

    if(callback) {
        callback();
    }

}