import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GET_ORDER_LIST } from '@constants/api'
import fetch from '@utils/request'


import OrderItem from '../order-item'

import './index.scss'

const baseClass = 'tab'
class Index extends Component {

    // componentDidShow = async () => {
    //     await this.getData()
    // }

    componentDidMount = () => {
        this.getData()
    }

    asyncSetState = async state => new Promise(resolve => { this.setState(state, (res => { res({ message: '更新完成', state }) }).bind(this, resolve)) })

    getData = async () => {
        Taro.showLoading({ title: '加载中...' })
        const { Id } = this.props
        const payload = {}
        if (Id === 'verb__non-pay') payload.PayState = 0
        // else if (Id === 'verb__be-use') payload
        else if (Id === 'verb__expired') payload.State = 2          // 退款
        else if (Id === 'verb__evaluate') payload.PayState = 1      // 暂时是已支付

        const params = {
            url: GET_ORDER_LIST,
            payload
        }
        try {
            const response = await fetch(params)
            if (!response) return Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
            await this.asyncSetState({ orderMains: response })
        } catch (error) {
            Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
        }
        Taro.hideLoading()
    }

    render () {
        const { orderMains } = this.state
        return (
            <View className={`${baseClass}`}>
                {orderMains && orderMains.length !== 0 && orderMains.map(item => {
                    return <OrderItem key={JSON.stringify(item.Id)} data={item} />
                })}
            </View>
        )
    }

}

export default Index