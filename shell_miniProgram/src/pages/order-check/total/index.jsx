import Taro, { PureComponent } from '@tarojs/taro'
import { ClText } from "mp-colorui";
import { View } from '@tarojs/components'

import './index.scss'

const baseClass = 'totalComponent'

class Index extends PureComponent {

    render () {
        return (
            <View className={`${baseClass}`}>
                <View className={`${baseClass}__item theme-title`}>
                    <View  className={`${baseClass}__item_title`}>
                        <ClText text='商品总额' size='normal' textColor='black' />
                    </View>
                    <View  className={`${baseClass}__item_right`}>
                        <ClText text='￥222' size='normal' textColor='black' />
                    </View>
                </View>
                <View className={`${baseClass}__item`}>
                    <View  className={`${baseClass}__item_title`}>
                        <ClText text='应付金额' size='normal' textColor='black' />
                    </View>
                    <View  className={`${baseClass}__item_right red`}>
                        <ClText text='￥222' size='normal' textColor='red' />
                    </View>
                </View>
            </View>
        )
    }
}

export default Index