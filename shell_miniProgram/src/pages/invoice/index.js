import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components' 
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cart'
import './index.scss'

@connect(state => ({...state.cart, ...state.global}) , { ...actions }) 
class Index extends Component {
  config = {
    navigationBarTitleText: '已购买'
  }

  state = {
    
  }

  async componentDidShow() {
    
  }

  async componentWillReceiveProps(nextProps){

  }


  render () {
    return (
      <View className='cart'>
        二维码出现没有？
      </View>
    )
  }
}

export default Index
