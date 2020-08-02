import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

const baseClass = 'buttonComponent'
export default class Index extends PureComponent {

    componseClassName({ type='primary', size='normal' }) {
        let styles = ''
        switch(type) {
            case 'primary': 
                styles += ' primary'
                break
            case 'secondary':
                styles += ' secondary'
                break
            case 'other':
                styles += ' other'
                break
            default:
                break
        }
        switch(size) {
            case 'normal': 
                styles += ' normal'
                break
            case 'small':
                styles += ' small'
                break
            case 'large':
                styles += ' large'
                break
            default:
                break
        }

        return styles
    }

    handleClick = () => {
        const { onClick } = this.props
        onClick && onClick()
    }

    render () {
        const { text } = this.props
        const styles = this.componseClassName(this.props)
        return (
            <View onClick={this.handleClick} className={`${baseClass} ${styles}`}>
                {text}
            </View>
        )
    }

}