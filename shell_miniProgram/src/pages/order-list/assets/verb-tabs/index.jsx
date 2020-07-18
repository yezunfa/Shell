import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GET_ORDER_LIST, GET_ORDER_LIST_SUB } from '@constants/api'
import Empty from '@components'
import fetch from '@utils/request'


import OrderMainItem from '../order-main-item'

import './index.scss'

const orderMainArr = ['verb__all', 'verb__non-pay', 'verb__expired']
const orderSubArr = ['verb__be-use', 'verb__evaluate']

const baseClass = 'tab'
class Index extends Component {

    state ={
        isEmpty: false,
    }

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
        // const url = orderMainArr.find(i => i === Id) ? GET_ORDER_LIST : GET_ORDER_LIST_SUB
        const params = {
            url: GET_ORDER_LIST,
            payload,
            pureReturn: true,
        }
        try {
            const response = await fetch(params)
            if (!response) return Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
            if (!response.success) return Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
            const { message, data } = response
            if (message === '暂无相关的订单~') {
                await this.asyncSetState({ isEmpty: true })    
                Taro.showToast({ title: '您还没有任何订单哦', icon: 'none' })
                return
            }
            await this.asyncSetState({ orderMains: data })
        } catch (error) {
            Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
        }
        Taro.hideLoading()
    }

    render () {
        const { orderMains, isEmpty } = this.state
        return (
            <View className={`${baseClass}`}>
                {orderMains && orderMains.length !== 0 && orderMains.map(item => {
                    return <OrderMainItem key={JSON.stringify(item.Id)} data={item} />
                })}
                {isEmpty && <Empty/> }
            </View>
        )
    }

}

export default Index