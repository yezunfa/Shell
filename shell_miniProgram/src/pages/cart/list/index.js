/*
 * @Author: yezunfa
 * @Date: 2019-07-22 16:56:19
 * @LastEditTime: 2020-12-02 16:24:27
 * @Description: Do not edit
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { CheckboxItem, InputNumber } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cart'
import './index.scss'


@connect(state => ({...state.cart, ...state.global}) , { ...actions }) 
export default class List extends Component {
  
  state = {
    ProductList:[]
  }

  async componentWillReceiveProps(nextProps){
    const { ProductList } = nextProps
    await this.setState({ ProductList })
  }

  handleUpdate = async  (item, newAmount) => {
    const { dispatchUpdateCheck, isUpdate } = this.props
    const { ProductList } = this.state
    const NewList = ProductList
    const ItemIndex = ProductList.findIndex((ele)=>item.Id === ele.Id)
    
    NewList[ItemIndex] = { ...item, Amount: newAmount }
    await dispatchUpdateCheck({NewList, isUpdate:!isUpdate})
  }

  handleUpdateCheck = async (item) => {
    const { dispatchUpdateCheck, isUpdate } = this.props
    const { ProductList } = this.state
    const NewList = ProductList
    const ItemIndex = ProductList.findIndex((ele)=>item.Id === ele.Id)
    NewList[ItemIndex] = { ...item, checked: !item.checked }

    await dispatchUpdateCheck({NewList, isUpdate:!isUpdate})
  }

  handleRemove = () => {
    // XXX 暂未实现左滑删除
  }

  render () {
    const { ProductList:list } = this.state
    return (
      <View className='cart-list'>
        {list && list.map(item => (
          <View
            key={item.Id}
            className='cart-list__item'
          >
            <CheckboxItem
              checked={item.checked}
              onClick={this.handleUpdateCheck.bind(this, item)}
            />
            <Image
              className='cart-list__item-img'
              src={JSON.parse(item.BannerList)[0]}
              onClick={() => {
                Taro.navigateTo({ url: `/pages/product/index?Id=${item.Id}` })  
              }}
            />
            <View className='cart-list__item-info'>
              <View className='cart-list__item-title' 
                onClick={() => {
                Taro.navigateTo({ url: `/pages/product/index?Id=${item.Id}` })  
              }}>
                {!!item.TypeName &&
                  <Text className='cart-list__item-title-tag'>{item.TypeName}</Text>
                }
                <Text className='cart-list__item-title-name' numberOfLines={1}>
                  {item.Name}
                </Text>
              </View>

              <View className='cart-list__item-spec'  
                onClick={() => {
                Taro.navigateTo({ url: `/pages/product/index?Id=${item.Id}` })  
              }}>
                <Text className='cart-list__item-spec-txt'>
                  暂不支持规格选择
                  {/* {item.specList.map(sepc => sepc.specValue).join(' ')} */}
                </Text>
              </View>

              <View className='cart-list__item-wrap'>
                <Text className='cart-list__item-price'>
                  ¥{item.Price}
                </Text>
                <View className='cart-list__item-num'>
                  <InputNumber
                    num={item.Amount}
                     onChange={this.handleUpdate.bind(this, item)}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    )
  }
}
