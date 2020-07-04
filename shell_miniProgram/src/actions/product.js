/*
 * @Author: yezunfa
 * @Date: 2020-06-30 01:10:24
 * @LastEditTime: 2020-07-03 11:20:53
 * @Description: Do not edit
 */ 
import { createAction } from '@utils/redux'
import { PRODUCT_INFO, PRODUCT_TYPE, CART_ADD } from '@constants/product'
import { GET_PRODUCT_INFO, GET_PRODUCT_TYPE, API_CART_ADD } from '@constants/api'

// 获取商品类型 product_type
export const dispatchProductType = payload => createAction({
  url: GET_PRODUCT_TYPE,
  type: PRODUCT_TYPE,
  payload
})

// 更新商品列表信息 product
export const dispatchProductInfo = payload => createAction({
    url: GET_PRODUCT_INFO,
    type: PRODUCT_INFO,
    payload
})
 