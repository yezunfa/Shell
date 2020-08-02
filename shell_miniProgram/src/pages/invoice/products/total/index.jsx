import Taro, { PureComponent } from '@tarojs/taro'
import { ClText } from "mp-colorui";
import { View } from '@tarojs/components'

import './index.scss'

const baseClass = 'totalComponent'

class Index extends PureComponent {

    render () {
        const { data={} } = this.props
        const { TotalPrice=0 } = data
        return (
            <View className={`${baseClass}`}>
                <View className={`${baseClass}__item theme-title`}>
                    <View  className={`${baseClass}__item_title`}>
                        <ClText text='商品总额' size='normal' textColor='black' />
                    </View>
                    <View  className={`${baseClass}__item_right`}>
                        <ClText text={`￥${TotalPrice}`} size='normal' textColor='black' />
                    </View>
                </View>
                <View className={`${baseClass}__item`}>
                    <View  className={`${baseClass}__item_title`}>
                        <ClText text='已支付金额' size='normal' textColor='black' />
                    </View>
                    <View  className={`${baseClass}__item_right red`}>
                        <ClText text={`￥${TotalPrice}`} size='normal' textColor='red' />
                    </View>
                </View>
            </View>
        )
    }
}

export default Index