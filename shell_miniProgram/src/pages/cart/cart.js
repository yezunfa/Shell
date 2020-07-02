/*
 * @Author: yezunfa
 * @Date: 2019-07-22 16:56:19
 * @LastEditTime: 2020-07-02 21:01:13
 * @Description: Do not edit
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { ClShopBar } from "mp-colorui";
import { getWindowHeight } from '@utils/style'
import isEmpty from './empty'
import List from './list'
import './cart.scss'

const buttons = [ {text:'加入购物车', bgColor: 'orange'}, {text: '立即购买'} ]
const openTypes = [
  {
    icon: "friendfamous",
    title: "用户",
    moreAction: {
      openType: 'getUserInfo',
      onGetUserInfo: res => {
        if (res.detail.userInfo) {
          Taro.showToast({
            title: res.detail.userInfo.nickName,
            icon: "none"
          });
        }
      }
    }
  },
  {
    icon: "share",
    title: '分享',
    moreAction: {
      openType: 'share'
    }
  }
]

// @connect(state => state.cart, actions)
class Index extends Component {
  config = {
    navigationBarTitleText: '购物车'
  }

  state = {
    loaded: false,
    isShowFooter: true,
    isEmpty: true,
  }

  componentDidShow() {
    
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
            <ClShopBar
              onClickButton={index => {
                this.clickButton(index);
              }}
              tabs={openTypes}
              buttons={buttons}
            />
          </View>
        }
      </View>
    )
  }
}

export default Index
