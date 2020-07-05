import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import Products from './products'
import StoreAddressPick from './store-address-pick'
import UserInfo from './user-info'
import PayMethod from './pay-method'

class Index extends Component {

    render () {
        return (
            <View className='order'>
                <Products />
                <StoreAddressPick />
                <UserInfo />
                <PayMethod />
                <View className='order-total'>
                    产品总金额和应付金额
                </View>
            </View>
        )
    }

}

export default Index