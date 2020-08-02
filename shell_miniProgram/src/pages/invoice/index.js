import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components' 
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cart'
import { uuid_compression } from '@utils/methods'
import { API_GET_APP_QRCODE, GET_ORDER_DETAIL } from '@constants/api'
import fetch from '@utils/request'
import './index.scss'

import StoreAddressPick from './store-address-pick'
import UserInfo from './user-info'
import Products from './products'

const baseclass = 'page-invoice'

@connect(state => ({...state.cart, ...state.global}) , { ...actions }) 
class Index extends Component {
  config = {
    navigationBarTitleText: '已购买'
  }

  state = {
    qrcode: null,
    loaded: false,
    OrderSubList: [], 
    OrderMain: {},
  }

  async componentDidMount() {
    const { OrderMainId } = this.$router.params
    const url = `${API_GET_APP_QRCODE}?scene=${uuid_compression(OrderMainId)}`
    const qrcode = await fetch({ url }) // 获取签到二维码
    await this.asyncSetState({ qrcode })

    await this.getDetail()

  }

  getDetail = async () => {
    await this.asyncSetState({ loaded: false })
    const { OrderMainId } = this.$router.params
    const payload = { Id:OrderMainId }
    const params = {
        url: GET_ORDER_DETAIL,
        payload
    }
    try {
        const response = await fetch(params)
        if (!response) return Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
        const { OrderSubList, OrderMain } = response
        await this.asyncSetState({ OrderSubList, OrderMain })
        console.log(OrderMain)
    } catch (error) {
        Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
    }
}

  asyncSetState = async state => new Promise(resolve => { this.setState(state, (res => { res({ message: '更新完成', state }) }).bind(this, resolve)) })

  render () {
    const { OrderSubList, OrderMain, qrcode } = this.state
    return (
      <View className={baseclass}>
                <View>
                    <Products productData={OrderSubList} orderData={OrderMain} />
                </View>
                <View className={`${baseclass}_component`}>
                    <StoreAddressPick />
                </View>
                <View className={`${baseclass}_component`}>
                    <UserInfo orderData={OrderMain} />
                </View>
                {qrcode &&
                  <View className={`${baseclass}_qrcode`}>
                    <Image src={qrcode} className='qrcode'/>
                    <View className={`${baseclass}_context`}>
                      请给前台出示此二维码进行核销
                    </View>
                </View>
                }
                
            </View>
      
    )
  }
}

export default Index
