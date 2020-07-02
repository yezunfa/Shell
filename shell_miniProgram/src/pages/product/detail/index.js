import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {
  static defaultProps = {
    html: ''
  }

  render () {
    const { html } = this.props

    // XXX 这边直接把 img 提取出来展示，没有用 RichText
    const imgList = []
    const imgReg = /<img.*?(?:>|\/>)/gi
    const srcReg = /src=[\'\"]?\\(.*)\\[\'\"]?/
    const imgArr = html.match(imgReg)
    if (imgArr && imgArr.length) {
      for (let i = 0; i < imgArr.length; i++) {
        const src = imgArr[i].match(srcReg)
        if (src[1]) {
          imgList.push(src[1])
        }
      }
    }
    return (
      <View className='item-detail'>
        {imgList && imgList.map((item, index) => (
          <Image
            key={JSON.stringify(index)}
            className='item-detail__img'
            src={item}
            mode='widthFix'
          />
        ))}
      </View>
    )
  }
}
