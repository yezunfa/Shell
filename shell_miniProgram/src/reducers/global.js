//小程序-全局
const defaultState = {
    userinfo: {},
    login: true 
}
//属于page_invite
export default function global(state = defaultState, action) {
    const { userinfo } = state;
    const { type, payload } = action
    switch (type) {
        case "userInfo": return { ...state, userinfo: payload }
        case "userMobile":
            userinfo.Mobile = payload;
            return { ...state, userinfo }
        default: return state
    }
}