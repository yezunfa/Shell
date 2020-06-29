/*
 * @Author: yezunfa
 * @Date: 2019-07-22 16:56:19
 * @LastEditTime: 2020-06-30 01:20:33
 * @Description: Do not edit
 */ 
import { combineReducers } from 'redux'
import home from './home'
import global from './global'
import product from './product'

export default combineReducers({
  home,
  global,
  product
})
