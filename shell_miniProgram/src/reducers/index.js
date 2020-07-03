/*
 * @Author: yezunfa
 * @Date: 2019-07-22 16:56:19
 * @LastEditTime: 2020-07-03 11:20:31
 * @Description: Do not edit
 */ 
import { combineReducers } from 'redux'
import home from './home'
import global from './global'
import product from './product'
import cart from './cart'

export default combineReducers({
  home,
  global,
  product,
  cart
})
