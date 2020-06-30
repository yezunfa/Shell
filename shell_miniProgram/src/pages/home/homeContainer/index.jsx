import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import icons from '../assets'
import { connect } from '@tarojs/redux'

import './index.scss'


const baseClass = 'Container'
export default class HomeContainer extends PureComponent {

    render () {
        const { title } = this.props
        const { slantingIcon } = icons
        return (
            <View className={baseClass}>
                <View className={`${baseClass}-title flex-row-space-center`}>
                    <View><Image className='icon' src={slantingIcon} /></View>
                    {title && title.length && title.split('').map((item, index) => {
                        if (!index) return <View key={JSON.stringify(index)} className={`${baseClass}-title-letter`}>{item}</View>
                        else return <View key={JSON.stringify(index)} className={`${baseClass}-title-letter`}>&ensp;·&ensp;{item}</View>
                    })}
                    <View><Image className='icon' src={slantingIcon} /></View>
                </View>
                <View className={`${baseClass}-body`}>
                    {this.props.children}
                </View>
            </View>
        )
    }
}


HomeContainer.defaultProps = {
    title: '默认'
}
