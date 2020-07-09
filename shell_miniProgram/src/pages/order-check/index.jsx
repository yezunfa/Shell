import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import Products from './products'
import StoreAddressPick from './store-address-pick'
import UserInfo from './user-info'
import PayMethod from './pay-method'
import Total from './total'

import './index.scss'

class Index extends Component {

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
                <View className='order__component'>
                    <Total />
                </View>
            </View>
        )
    }

}

export default Index