import Taro, { Component, startPullDownRefresh, stopPullDownRefresh } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './index.scss'

const baseclass = 'component-mongolia'

export default class Mongolia extends Component {
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
     * 生命周期函数: 预渲染
     */
    componentWillMount() {
        const { tabbar } = this.props
    }

    componentWillReceiveProps(newProps) {
        const { visible } = newProps // todo 重构
    }

    /**
     * 获取class
     */
    getMongoliaClass () {
        const { type, show } = this.props
        return classNames(
            baseclass,
            show && 'visible',
            type && `${baseclass}-${type}`
        )
    }

    /**
     * 点击空白
     * @param {*} event 
     */
    onClick(event) {
        const { onClick } = this.props
        onClick && onClick(event)
    }

    /**
     * 生命周期函数:渲染
     */
    render() {
        const { position } = this.props
        return(
            <View className = { `${this.getMongoliaClass()}` }>
                <View className = { `${baseclass}-layer ${baseclass}-${position}` }>
                    <View className = { `${baseclass}-child`}>
                        { this.props.children }
                    </View>
                    <View 
                        className = { `${baseclass}-space`}
                        onClick = { this.onClick.bind(this) }
                    />
                </View>
            </View>
        )
    }
}
Mongolia.defaultProps = {
    type: 'page', // 蒙层类型(page,component)
    show: false,
    position: 'center' // 子元素位置 center top bottom
}
Mongolia.propTypes = {
    type: PropTypes.string,
    show: PropTypes.bool
}