/*
 * @Author: yezunfa
 * @Date: 2019-07-22 16:56:19
 * @LastEditTime: 2020-07-03 12:07:56
 * @Description: Do not edit
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components' 
import { getWindowHeight } from '@utils/style'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cart'
import isEmpty from './empty'
import List from './list'
import Footer from './footer'
import './cart.scss'

@connect(state => ({...state.cart, ...state.global}) , { ...actions }) 
class Index extends Component {
  config = {
    navigationBarTitleText: '购物车'
  }

  state = {
    loaded: false,
    isShowFooter: true,
    isEmpty: true,
  }

  async componentDidShow() {
    console.log(this.props)
    const { dispatchCart, cartInfo } = this.props
    await dispatchCart()
  }

  render () {
    const { isShowFooter } = this.state
    return (
      <View className='cart'>
        <ScrollView
          scrollY
          className='cart__wrap'
          style={{ height: getWindowHeight() }}
        >
          {/* {isEmpty && <isEmpty/>
          } */}
          <List />
        </ScrollView>

        {isShowFooter &&
          <View className='cart__footer'>
          <Footer 
          /> 
          </View>
        }
      </View>
    )
  }
}

export default Index
