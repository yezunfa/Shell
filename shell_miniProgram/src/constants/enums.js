export const system_code = {
    success: 200,
    redirect: 403,
    auth_expired: 600,
    properties:{
        200:{ name: "成功", value: 200, code: 200 },
        403:{ name: "请求被重定向", value: 403, code: 403 },
        600:{ name: "登录信息已过期", value: 600, code: 600 }
    }
}