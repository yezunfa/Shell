import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GET_ORDER_LIST } from '@constants/api'
import fetch from '@utils/request'

import './index.scss'

class Index extends Component {

    state = {
        loadding: true,
    }

    componentDidMount = () => {
        this.getData()
    }

    getData = async () => {
        const params = {
            url: GET_ORDER_LIST,
        }
        try {
            const response = await fetch(params)
            console.log(response);
            if (!response) return Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
        } catch (error) {
            Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
        }
    }

    render () {
        return (
            <View>订单列表</View>
        )
    }

}

export default Index