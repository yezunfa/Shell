/*
 * @Author: yezunfa
 * @Date: 2020-06-30 01:11:34
 * @LastEditTime: 2020-06-30 01:59:43
 * @Description: Do not edit
 */ 
import { PRODUCT_INFO, PRODUCT_TYPE  } from '@constants/product'
  
  const INITIAL_STATE = {
    productType:[],
    productInfo: [], 
  }
  
  export default function product(state = INITIAL_STATE, action) {
    switch(action.type) {
      case PRODUCT_TYPE: {
        return {
          ...state,
          productType: action.payload
        }
      }
      case PRODUCT_INFO: {
        return {
          ...state,
          productInfo: action.payload
        }
      }
      default:
        return state
    }
  }
  