import { createAction } from '@utils/redux'

// 更新用户信息
export const dispatchUserInformation = payload => dispatch => dispatch({ type: "userInfo", payload })

// 更新用户手机号
export const saveUserMobile = payload => {
    const type = "userMobile"
    return createAction({ type, payload })
}