import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { Login } from '@utils/wechat'
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
    await this.wechatLogin()
  }

    /**
   * 登录事件
   * @param {*} params 
   */
  async wechatLogin(params = {}) {
    const { dispatchUserInformation } = this.props
    try {
        //  await Taro.showLoading({title: '更新用户信息', mask: true})
        const { scene, userdata, redirect, redirectparams } = params
        const response = await Login({scene, userdata}) // 登录
        if (response.code === 200 ) {
          const { userinfo } = response.data
          await dispatchUserInformation({ ...userinfo })
        }
        // 更新用户信息
       
    } catch (error) {
        console.error(error)
        const icon = 'none'
        const title = "网络异常, 请刷新重试"
        // await Taro.hideLoading()
        Taro.showToast({icon, title})
    }
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
          <Menu />
          <View className='user__empty' />
        </ScrollView>
        <View className='user__activity'>
        </View>
      </View>
    )
  }

}

export default User
