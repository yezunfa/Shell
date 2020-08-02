import Taro, { Component, getWeRunData } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GET_ORDER_MAIN } from '@constants/api'
import fetch from '@utils/request'
import { OrderMainItem } from './assets/order-main-item'

const baseClass = 'page'

export default class Index extends Component {

    state = {
        isEmpty: false,
        orderMains: [],
    }

    // 需要先判断用户是否是管理员
    // 然后根据传过来的scene拉取会员还未使用的产品
    // 以order-main为主组件，内部可能有多个order-sub
    // order-sub用公用组件product(挂载数据)，右边有个核销的按钮
    // order-main计算还有多少个商品未用，已用了多少个商品
    componentDidMount = async () => {
        // ce2c9490b69211eab051890aa5912523
        const { OrderMainId } = this.$router.params
        // const scene = 'ce2c9490b69211eab051890aa5912523'
        await this.getData(OrderMainId)
    }

    asyncSetState = async state => new Promise(resolve => { this.setState(state, (res => { res({ message: '更新完成', state }) }).bind(this, resolve)) })

    getData = async (OrderMainId) => {
        const payload = {}
        payload.State = [1]
        payload.PayState = [1]
        payload.OrderMainId = OrderMainId
        const params = {
            url: GET_ORDER_MAIN,
            payload,
            pureReturn: true,
        }
        try {
            const response = await fetch(params)
            if (!response) return Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
            if (!response.success) return Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
            const { message, data } = response
            const { orderMain, orderSubList } = data
            orderMain.child = orderSubList
            if (message === '暂无相关的订单~') {
                this.setState({ isEmpty: true })    
                Taro.showToast({ title: '您还没有任何订单哦', icon: 'none' })
                return
            }
            await this.asyncSetState({ orderMains: [orderMain] })
        } catch (error) {
            console.error(error)
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