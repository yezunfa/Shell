/*
 * @Author: yezunfa
 * @Date: 2019-07-22 16:56:19
 * @LastEditTime: 2020-06-30 02:55:49
 * @Description: Do not edit
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { ClSearchBar, ClVerticalTab, ClVerticalTabCell } from "mp-colorui";
import { connect } from '@tarojs/redux'
import * as actions from '@actions/product'
import { getWindowHeight } from '@utils/style'
import './cate.scss'

const tabs = [...Array(50)].map((key, index) => ({name: 'tab-' + index, id: 'id-' + index}))

@connect(state => state.product, { ...actions })
class Cate extends Component {
  config = {
    navigationBarTitleText: '项目分类'
  }

  state = {
    productType:[],
    productInfo:[],
  }

  async componentDidMount() {
    const { productInfo, productType, dispatchProductInfo, dispatchProductType } = this.props
    if (!productInfo.length || !productType.length) {
      await dispatchProductType()
      await dispatchProductInfo()
      await this.setData()
    }
  }

  asyncSetState = state => new Promise(resolve => { this.setState(state, (res => { res({ message: '更新完成', state }) }).bind(this, resolve)) })
  
  async setData(){
    const { productInfo, productType } = this.props
    await this.asyncSetState({productInfo, productType})
  }

  render () {
    const { productInfo, productType } = this.state
    if (!productType.length) return 
    const height = getWindowHeight()
    return (
      <View className='cate'>
        <ClSearchBar
            shape='round'
            placeholder='请搜索你需要的服务项目'
            searchType='none'
            onTouchResult={(index) => {
              Taro.showToast({
                title: `您点击了${index}`,
                icon: 'none'
              })
            }}
          />
        <View style={{height:`${height}`}}>
            <ClVerticalTab tabs={productType} height={'full'} backTop={true}>
            <View>
              {productInfo.map((item) => (
                <View id={item.Type} key={JSON.stringify(item.Id)}>
                  <ClVerticalTabCell>
                    <View onClick={() => {
                      // console.log('item', item)
                      Taro.navigateTo({ url: `/pages/product/index?Id=${item.Id}` })
                    }}>{item.Name}</View> 
                    </ClVerticalTabCell>
                </View>
              ))}
            </View>
          </ClVerticalTab>
        </View>
        
      </View>
      
    )
  }
}

export default Cate
