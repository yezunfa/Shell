import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './index.scss'

const baseclass = 'component-button'

export default class ThemeButton extends PureComponent {
    /**
     * 生命周期函数:构造
     * @param {*} props 
     */
    constructor(props) {
        super(props)
        this.props = props
        this.state = {}
    }

    /**
     * 按钮事件
     * @param {*} event 
     */
    buttonClick(event) {
        event.stopPropagation()
        const { onClick, disabled } = this.props
        if (typeof disabled === 'string') Taro.showToast({icon: 'none', title: disabled})
        if (!disabled) onClick && onClick(event)
    }

    bubblingClick = (event) => {
        const { onClick, disabled } = this.props
        if (typeof disabled === 'string') Taro.showToast({icon: 'none', title: disabled})
        if (!disabled) onClick && onClick(event)
    }

    /**
     * 获取class
     */
    getClass () {
        const { type, size, disabled, shape, auto, shadow } = this.props
        return classNames(
            baseclass,
            auto && `${baseclass}-auto`,
            size && `${baseclass}-${size}`,
            type && `${baseclass}-${type}`,
            shape && `${baseclass}-${shape}`,
            disabled && `${baseclass}-disabled`,
            shadow && !disabled && `${baseclass}-shadow`,
        )
    }

    /**
     * 生命周期函数:渲染
     */
    render() {
        const { style, bubbling } = this.props
        const click = bubbling ? this.bubblingClick : this.buttonClick
        return(
            <View
                style={style}
                onClick={click}
                className={`${this.getClass()} ellipsis`} 
            >
            {this.props.children}
            </View>
            
        )
    }
}
ThemeButton.defaultProps = {
    type: 'primary', // 按钮类型(primary,default,dashed,danger,ghost)
    size: 'middle', // 按钮大小(small,large,middle,block[宽度=父元素])
    disabled: false, // 是否禁用
    shape: 'round', // 按钮形状 todo
    shadow: false,
    auto: true,
    bubbling: true
}
ThemeButton.propTypes = {
    type: PropTypes.string,
    shape: PropTypes.string,
    size: PropTypes.string,
    disabled: PropTypes.bool
}