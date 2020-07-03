/*
 * @Author: yezunfa
 * @Date: 2020-07-03 11:14:13
 * @LastEditTime: 2020-07-03 11:20:10
 * @Description: Do not edit
 */  
import { createAction } from '@utils/redux'
import { CART_ADD, CART_INFO  } from '@constants/cart'
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
