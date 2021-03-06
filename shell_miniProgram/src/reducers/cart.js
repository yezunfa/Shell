/*
 * @Author: yezunfa
 * @Date: 2020-07-03 11:17:33
 * @LastEditTime: 2020-07-04 17:55:35
 * @Description: Do not edit
 */ 
import Taro from '@tarojs/taro'
import { CART_INFO,  CART_ADD, CART_NUM, CART_UPDATE_CHECK } from '@constants/cart'

const INITIAL_STATE = {
  cartInfo: {}, 
  cartParentId: '',
  isUpdate: false,
}

// TODO H5、RN 还不支持 setTabBarBadge
const updateTabBar = (count) => {
  if (count > 0) {
    Taro.setTabBarBadge({
      index: 2,
      text: `${count}`
    })
  } else {
    Taro.removeTabBarBadge({
      index: 2
    })
  }
}

export default function cart(state = INITIAL_STATE, action) {
  switch(action.type) {
    case CART_INFO:
        return {
            ...state,
            cartParentId:action.payload ? action.payload.Id : '',
            cartInfo: action.payload ? action.payload.productArray : []
          } 
    case CART_ADD: 
    case CART_UPDATE_CHECK: {
      return {
        ...state,
        cartInfo: action.payload.NewList,
        isUpdate: action.payload.isUpdate
      }
    }
    case CART_NUM: {
      updateTabBar(action.payload.countCornerMark)
      return state
    } 
    default:
      return state
  }
}
