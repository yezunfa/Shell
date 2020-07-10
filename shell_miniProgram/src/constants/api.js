/**
 * NOTE HOST、HOST_M 是在 config 中通过 defineConstants 配置的
 * 只所以不在代码中直接引用，是因为 eslint 会报 no-undef 的错误，因此用如下方式处理
 */
/* eslint-disable */
export const host = HOST
export const hostM = HOST_M
/* eslint-enable */

// const HOST = '"https://miniapp.you.163.com"'
// const HOST_M = '"https://m.you.163.com"'
// pic
export const CDN = 'https://yanxuan.nosdn.127.net'
export const DefaultLog = 'http://cdn.shuaixiaoxiao.com/image/20200704155855.jpg'

// pay 
export const POST_SUBMIT_WECHAT_PAY = `${host}/payment/wxpay/submit` // 微信支付提交接口
export const POST_SUBMIT_WECHAT_REFUND = `${host}/payment/wxpay/refund` // 微信支付退款接口
export const POST_ORDER_PAYMENTCANCEL = `${host}/order/payment/cancel` // 微信支付失败接口

// home
export const API_HOME = `${host}/xhr/index/index.json`
export const API_HOME_SEARCH_COUNT = `${host}/xhr/search/displayBar.json`
export const API_HOME_PIN = `${hostM}/pin/min/item/recommend.json`
export const API_HOME_RECOMMEND = `${host}/xhr/rcmd/index.json`

// product
export const GET_PRODUCT_TYPE = `${host}/api/productType/getType`
export const GET_PRODUCT_INFO = `${host}/api/productList/getAllProduct`

// cart
export const API_CART_ADD = `${host}/api/cart/add`
export const API_CART = `${host}/api/cart/getByUserId`

export const POST_CART_ORDER = `${host}/api/cart/createOrder` // 创建订单

export const API_CART_NUM = `${host}/xhr/promotionCart/getMiniCartNum.json`
export const API_CART_RECOMMEND = `${host}/xhr/rcmd/cart.json`
export const API_CART_UPDATE = `${host}/xhr/promotionCart/update.json`
export const API_CART_UPDATE_CHECK = `${host}/xhr/promotionCart/updateCheck.json`

// user
export const API_USER = `${host}/xhr/user/getDetail.json`
export const API_USER_LOGIN = `${host}/xhr/u/mailLogin.json`
export const API_CHECK_LOGIN = `${host}/xhr/u/checkLogin.json`

// item
export const API_ITEM = `${host}/xhr/item/detail.json`
export const API_ITEM_RECOMMEND = `${host}/xhr/rcmd/itemDetail.json`

// user 在这里设置用户接口
export const USER_LOGIN = `${host}/api/shell_login/wechat`  // √
export const POST_WECHAT_CRYP_DATA = `${host}/api/shell_wechat/cryptdata`

// 商品接口
export const GET_PRODUCT_DETAIL = `${host}/api/product/detail`  // √

// 购物车
export const POST_CREATE_CART_PRODUCT = `${host}/api/cart/add`  // √

// 订单
export const GET_ORDER_DETAIL = `${HOST}/api/order/detail`  // √
export const POST_ORDER_EDIT = `${HOST}/api/order/edit`