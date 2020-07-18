import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { DefaultLog } from '@constants/api'
import { ClText, ClInput } from "mp-colorui"

import './index.scss'

class Index extends PureComponent {

    render () {
        const { item={} } = this.props
        const {
            BannerList='[]',
            ProductName='-',
            Introduce='-',
            Price='-',
            Count='-'
        } = item
        const Banner = JSON.parse(BannerList)[0]
        return (
            <View className='products-list__item flex-row-space-between'>
                <View className='products-list__item_img'>
                    <Image className='image' src={Banner || DefaultLog} mode='aspectFit' />
                </View>
                <View className='products-list__item_container'>
                    <ClText text={ProductName} size='normal' textColor='black' />
                    <ClText text={Introduce} size='xsmall' textColor='black' />
                </View>
                <View className='products-list__item_number'>
                    <ClText text={`￥${Price}`} size='normal' textColor='black' />
                    <ClText text={`x${Count}`} size='normal' textColor='grey' />
                </View>
            </View>
        )
    }
}

export default Index