import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

const baseClass = 'consult-button-fix-component'

class Index extends PureComponent {

    render() {
        return (
            <View className={`${baseClass} at-row`}>
                <View className={`${baseClass}-left`}>免费咨询</View>
                <View className={`${baseClass}-right`}>立即咨询报价</View>
            </View>
        )
    }

}

export default Index