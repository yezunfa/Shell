/*
 * @Author: yezunfa
 * @Date: 2019-07-22 16:56:19
 * @LastEditTime: 2020-07-03 10:44:27
 * @Description: Do not edit
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { DefaultLog, POST_CREATE_CART_PRODUCT } from '@constants/api'
import { Popup, Spec } from '@components'
import { ClSearchBar, ClVerticalTab, ClVerticalTabCell, ClText } from "mp-colorui";
import { handleLongIntroduce } from '@utils/public'
import fetch from '@utils/request'
import { connect } from '@tarojs/redux'
import icons from '@assets'
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
    visible: false,
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

  toggleVisible = async () => {
    await this.asyncSetState({ visible: !this.state.visible, selected: {} })
  }

  addCart = async (product, e) => {
    e.stopPropagation()
    await this.asyncSetState({ visible: true, curProduct: product })
  }

  handleAddCart = async (product) => {
    const { selected, cnt, data } = product
    const { Id } = data
    const payload = { 
        ProductId:  Id,
        Amount: cnt,
    }
    const params = {
        url: POST_CREATE_CART_PRODUCT,
        payload,
        method: 'POST',
        Login: true,
    }
    const response = await fetch(params)
    await this.asyncSetState({ visible: false })
    if (response) return Taro.showToast({ title: '成功加入购物车', icon: 'success' })
    return Taro.showToast({ title: '服务器繁忙，请重试', icon: 'none' })
  }

  render () {
    const { productInfo, productType, visible, curProduct } = this.state
    if (!productType.length) return 
    const height = getWindowHeight()

    const popupStyle = process.env.TARO_ENV === 'rn' ?
        { transform: [{ translateY: Taro.pxTransform(0) }] } :
        { transform: `translateY(${Taro.pxTransform(0)})` }

    return (
      <View className='cate'>
        {/* <ClSearchBar
            shape='round'
            placeholder='请搜索你需要的服务项目'
            searchType='none'
            onTouchResult={(index) => {
              Taro.showToast({
                title: `您点击了${index}`,
                icon: 'none'
              })
            }}
          /> */}
        <View style={{height:`${height}`}}>
            <ClVerticalTab tabs={productType} height={'full'} backTop={true}>
            <View>
              {productInfo.map((item) => {
                const { BannerList, Name, Price, Introduce } = item
                const banner = JSON.parse(BannerList)
                return <View id={item.Type} key={JSON.stringify(item.Id)}>
                  <ClVerticalTabCell>
                    <View className='cate__item' onClick={() => {
                      // console.log('item', item)
                      Taro.navigateTo({ url: `/pages/product/index?Id=${item.Id}` })
                    }}>
                      <View className='cate__item_img'>
                        <Image className='image' src={banner[0] || DefaultLog} mode='aspectFit' />
                      </View>
                      <View className='cate__item_container'>
                        <ClText text={Name} size='normal' textColor='black' />
                        <ClText text={`￥${Price}`} size='xsmall' textColor='red' />
                        <ClText text={handleLongIntroduce(Introduce)} size='xsmall' />
                      </View>
                      <View className='cate__item_icon'>
                        <Image onClick={this.addCart.bind(this, item)} className='icon' src={icons.cart} />
                      </View>
                    </View>
                  </ClVerticalTabCell>
                </View>
              })}
            </View>
          </ClVerticalTab>
          <Popup
              visible={visible}
              onClose={this.toggleVisible}
              compStyle={popupStyle}
          >
              <Spec
                  data={curProduct}
                  // selected={selected}            
                  // onSelect={this.handleSelect}   // 选规格的
                  onAddCart={this.handleAddCart}  // 加入购物车(入库)
              />
          </Popup>
        </View>
        
      </View>
      
    )
  }
}

export default Cate
