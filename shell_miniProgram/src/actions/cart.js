/*
 * @Author: yezunfa
 * @Date: 2020-07-03 11:14:13
 * @LastEditTime: 2020-07-03 11:20:10
 * @Description: Do not edit
 */  
import { createAction } from '@utils/redux'
import { CART_ADD, CART_INFO, CART_UPDATE, CART_UPDATE_CHECK  } from '@constants/cart'
import { API_CART_ADD, API_CART } from '@constants/api'
 
/**
 * 添加商品到购物车
 * @param {*} payload
 */
export const dispatchAdd = payload => createAction({
  url: API_CART_ADD,
  method: 'POST',
  type: CART_ADD,
  payload
})

/**
 * 购物车信息
 * @param {*} payload
 */
export const dispatchCart = payload => createAction({
  url: API_CART,
  type: CART_INFO,
  payload
})

/**
 * 更新商品选中状态
 * @param {*} payload
 */
export const dispatchUpdateCheck = payload => dispatch => dispatch({ type: CART_UPDATE_CHECK, payload })

// /**
//  * 更新选中商品信息
//  * @param {*} payload
//  */
// export const dispatchUpdate = payload => createAction({
//   url: API_CART_UPDATE,
//   method: 'POST',
//   type: CART_UPDATE,
//   payload
// })

