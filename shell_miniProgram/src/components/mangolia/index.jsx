import Taro, { Component } from '@tarojs/taro'
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
     * 获取class
     */
    getMongoliaClass () {
        const { type } = this.props
        return classNames(
            baseclass,
            type && `${baseclass}-${type}`
        )
    }

    /**
     * 生命周期函数:渲染
     */
    render() {
        const { show } = this.props
        return(
            <View className = { `${this.getMongoliaClass()} ${show ? 'visible' : ''}` }>
                <View className = { `${baseclass}-layer` }>
                { this.props.children }
                </View>
            </View>
        )
    }
}
Mongolia.defaultProps = {
    type: 'page', // 蒙层类型(page,component)
    show: false
}
Mongolia.propTypes = {
    type: PropTypes.string,
    show: PropTypes.bool
}