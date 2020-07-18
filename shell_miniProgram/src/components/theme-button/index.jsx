import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

const baseClass = 'buttonComponent'
export default class Index extends PureComponent {

    render () {
        const { text } = this.props
        return (
            <View className={`${baseClass}`}>
                {text}
            </View>
        )
    }

}