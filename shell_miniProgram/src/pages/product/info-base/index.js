/*
 * @Author: yezunfa
 * @Date: 2020-07-02 21:19:00
 * @LastEditTime: 2021-04-11 17:00:25
 * @Description: Do not edit
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import rightArrow from './assets/right-arrow.png'
import './index.scss'

export default class InfoBase extends Component {
  static defaultProps = {
    data: {}
  }

   shareCode() {
    const { onOpenCode } = this.props
    onOpenCode && onOpenCode()
  }

  render () {
    const { data } = this.props
    const { itemStar = {}, tagList = [] } = data

    return (
      <View className='item-info-base'>
        <View className='item-info-base__header'>
          <View className='item-info-base__header-wrap'>
            <Text className='item-info-base__header-name'>{data.Name}</Text>
            <Text className='item-info-base__header-desc'>{data.simpleDesc}</Text>
          </View>
          <View className='item-info-base__header-star'>
          <Button className='item-info-base__header-star-icon' open-type = 'share' />
            <Text className='item-info-base__header-star-txt'>
              {`${parseFloat(itemStar.goodCmtRate) || 0}%`}
            </Text>
            <Text className='item-info-base__header-star-link' onClick={this.shareCode}>{'海报分享 >'}</Text>
          </View>
        </View>

        <View className='item-info-base__price'>
          <Text className='item-info-base__price-symbol'>¥</Text>
          <Text className='item-info-base__price-txt'>
            {data.activityPrice || data.retailPrice}
          </Text>
          {!!data.activityPrice &&
            <Text className='item-info-base__price-origin'>
              ¥{data.retailPrice}
            </Text>
          }
        </View>

        {!!tagList.length &&
          <View className='item-info-base__tag'>
            {tagList.map(item => (
              <View key={item.id} className='item-info-base__tag-item'>
                <Text className='item-info-base__tag-item-txt'>{item.tagName}</Text>
                <Image className='item-info-base__tag-item-img' src={rightArrow} />
              </View>
            ))}
          </View>
        }
      </View>
    )
  }
}
