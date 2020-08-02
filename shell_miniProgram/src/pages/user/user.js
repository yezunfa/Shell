/*
 * @Author: yezunfa
 * @Date: 2020-07-02 21:19:00
 * @LastEditTime: 2020-08-02 19:03:18
 * @Description: Do not edit
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as globalactions from '@actions/global'
import { getWindowHeight } from '@utils/style'
import Profile from './profile'
import Menu from './menu'
import './user.scss'

@connect(({global}) => ({...global}),{...globalactions})
class User extends Component {
  config = {
    navigationBarTitleText: '个人中心'
  }

  async componentDidMount() {
    // this.props.dispatchUser()
    // this.props.dispatchCartNum()
  }

  render () {
    const { userinfo } = this.props

    return (
      <View className='user'>
        <ScrollView
          scrollY
          className='user__wrap'
          style={{ height: getWindowHeight() }}
        >
          <Profile userinfo={userinfo} />
          <Menu userinfo={userinfo}/>
          <View className='user__empty' />
        </ScrollView>
        <View className='user__activity'>
        </View>
      </View>
    )
  }

}

export default User
