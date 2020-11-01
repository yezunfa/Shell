/*
 * @Author: yezunfa
 * @Date: 2020-07-18 16:03:07
 * @LastEditTime: 2020-10-28 21:39:28
 * @Description: Do not edit
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import jump from '@utils/jump'
import { uuid_decompression, resolveURL } from '@utils/methods'
import classNames from 'classnames'
import './index.scss'

const MENU_LIST = [{
  key: 'order',
  text: '我的订单',
  url: '/pages/order-list/index',
  img: require('./assets/order.png')
}, {
  key: 'contact',
  text: '联系客服',
  img: require('./assets/contact.png')
}, {
  key: 'feedback',
  text: '用户反馈',
  img: require('./assets/feedback.png')
}, {
  key: 'pin',
  text: '我的拼团',
  img: require('./assets/pin.png')
}, {
  key: 'bargain',
  text: '我的砍价',
  img: require('./assets/bargain.png')
}, {
  key: 'credit',
  text: '我的积分',
  img: require('./assets/credit.png')
}, {
  key: 'service',
  text: '退换/售后',
  img: require('./assets/service.png')
}, {
  key: 'coupon',
  text: '优惠券',
  img: require('./assets/coupon.png')
},{}]
const COUNT_LINE = 3

const SysUser_MENU_LIST =[{
  key: 'order_all',
  text: '最近订单',
  url: '/pages/all-order/index',
  img: require('./assets/order.png')
}, {
  key: 'check',
  text: '订单核销',
  img: require('./assets/contact.png')
},

]
export default class Menu extends Component {

  state = {
    IsSysUser: 0
  }

  componentDidShow(){
    const { userinfo } = this.props
    if (userinfo) {
      const { IsSysUser } = userinfo
      console.log(userinfo)
      this.setState({IsSysUser})
    }
  }

  handleClick = (menu) => {
    // NOTE 时间关系，此处只实现帮助中心，用于演示多端 webview
    switch(menu.key){
      case 'help': jump({ url: menu.url, title: menu.text })
         break;
      case 'order':jump({ url: menu.url, title: menu.text });
         break;
      case 'order_all':jump({ url: menu.url, title: menu.text });
      break;
      case 'check':this.openCamera();
      break;
      case 'contact':console.log('打开客服通道～')
      break;
      default:
         Taro.showToast({
          title: '暂不支持，尽请期待~',
          icon: 'none'
        })
    }
  }

  openCamera = async event =>{
    // event.stopPropagation()
    try {
      const { scanType, path } = await Taro.scanCode()
      if (scanType !== 'WX_CODE' && !path) throw new Error('二维码错误')
      const { params } = resolveURL(path)
      const OrderMainId = uuid_decompression(params.scene)
      // console.log(params)
      // console.log(uuid_decompression(params.scene))
      // todo: 跳转页面
      Taro.navigateTo({ url: `/pages/writeOffList/index?OrderMainId=${OrderMainId}` })
      // jump({ url: `pages/writeOffList/index?scene=${params.scene}`, title: '审核' });
    } catch (error) {
      console.error(error)
      const title = error.message
      Taro.showToast({title, icon: 'none'})
    }
  }

  render () {
    const { IsSysUser } = this.state  
    return (
      <View>
        <View className='user-menu'>
          {MENU_LIST.map((menu, index) => {
            // NOTE 不用伪元素选择器，需自行计算
            const nth = (index + 1) % COUNT_LINE === 0
            const lastLine = parseInt(index / COUNT_LINE) === parseInt(MENU_LIST.length / COUNT_LINE)
            return (
              <View
                key={menu.key}
                className={classNames(
                  'user-menu__item',
                  nth && 'user-menu__item--nth',
                  lastLine && 'user-menu__item--last',
                )}
                onClick={this.handleClick.bind(this, menu)}
              >
                {menu.key === 'contact' ? 
                <Button class="user-menu__item-contactButton" open-type="contact" session-from="weapp">
                  <Image className='user-menu__item-img' src={menu.img} />
                </Button>
                 : <Image className='user-menu__item-img' src={menu.img} />}
                <Text className='user-menu__item-txt'>{menu.text}</Text>
              </View>
            )
          })}
          </View>
          <View className='user-menu'>
              {IsSysUser && SysUser_MENU_LIST.map((menu, index) => {
                // NOTE 不用伪元素选择器，需自行计算
                const nth = (index + 1) % COUNT_LINE === 0
                const lastLine = parseInt(index / COUNT_LINE) === parseInt(MENU_LIST.length / COUNT_LINE)
                return (
                  <View
                    key={menu.key}
                    className={classNames(
                      'user-menu__item',
                      nth && 'user-menu__item--nth',
                      lastLine && 'user-menu__item--last',
                    )}
                    onClick={this.handleClick.bind(this, menu)}
                  >
                    <Image className='user-menu__item-img' src={menu.img} />
                    <Text className='user-menu__item-txt'>{menu.text}</Text>
                  </View>
                )
              })}
          </View>
          
      </View>
    )
  }
}
