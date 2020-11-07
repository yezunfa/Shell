/*
 * @Author: yezunfa
 * @Date: 2020-07-02 21:19:00
 * @LastEditTime: 2020-11-04 12:52:02
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
  
  onShareAppMessage () {
    const { data } = this.props
    return {
      title: '赣州贝壳口腔门诊部',
      desc: '卓越医疗，温暖服务!',
      path: `/pages/product/index?Id=${data.Id}`,
      imageUrl: `${data.primaryPicUrl}`
    }
  }

  onShareTimeline () {
    return {
      title: '赣州贝壳口腔门诊部',
      query: `Id=${data.Id}`,
      imageUrl: `${data.primaryPicUrl}`
    }
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
            <Text className='item-info-base__header-star-link'>{'好评率>'}</Text>
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
