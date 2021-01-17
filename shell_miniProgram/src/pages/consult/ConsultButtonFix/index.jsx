import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

const baseClass = 'consult-button-fix-component'

class Index extends PureComponent {

    render() {
        return (
            <View className={`${baseClass}`}>
                底部按钮框
            </View>
        )
    }

}

export default Index