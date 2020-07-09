import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GET_ORDER_DETAIL } from '@constants/api'
import fetch from '@utils/request'
import Products from './products'
import { ClButton } from "mp-colorui";
import StoreAddressPick from './store-address-pick'
import UserInfo from './user-info'
import PayMethod from './pay-method'

import './index.scss'

class Index extends Component {

    state = {
        loaded: false,
    }

    componentDidMount = async () => {
        // /api/order/detail
        this.getDetail()
    }

    asyncSetState = async state => new Promise(resolve => { this.setState(state, (res => { res({ message: '更新完成', state }) }).bind(this, resolve)) })

    getDetail = async () => {
        await this.asyncSetState({ loaded: false })
        const { Id } = this.$router.params
        const payload = { Id }
        const params = {
            url: GET_ORDER_DETAIL,
            payload
        }        
        try {
            const response = await fetch(params)
            console.log(response);
        } catch (error) {
            Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
        }
    }

    render () {
        return (
            <View className='order'>
                <View>
                    <Products />
                </View>
                <View className='order__component'>
                    <StoreAddressPick />
                </View>
                <View className='order__component'>
                    <UserInfo />
                </View>
                <View className='order__component'>
                    <PayMethod />
                </View>
                <View className='order__component button'>
                    <ClButton size='large' long shape='round' bgColor='gradualBlue'>确定支付</ClButton>
                </View>
            </View>
        )
    }

}

export default Index