/*
 * @Author: yezunfa
 * @Date: 2019-07-22 16:56:19
 * @LastEditTime: 2020-07-02 21:16:01
 * @Description: Do not edit
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import checkedIcon from './assets/check.svg'
import unCheckedIcon from './assets/uncheck.svg'
import './index.scss'

export default class CheckBoxItem extends Component {
  static defaultProps = {
    compStyle: '',
    checked: false,
    onClick: () => {}
  }

  render () {
    const { compStyle, checked } = this.props
    return (
      <View
        className='comp-checkbox'
        style={compStyle}
        onClick={this.props.onClick}
      >
        <Image
          className='comp-checkbox__img'
          src={checked ? checkedIcon : unCheckedIcon}
        />
        {this.props.children}
      </View>
    )
  }
}
