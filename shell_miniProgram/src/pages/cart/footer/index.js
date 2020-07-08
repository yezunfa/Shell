/*
 * @Author: yezunfa
 * @Date: 2019-07-22 16:56:19
 * @LastEditTime: 2020-07-08 17:17:55
 * @Description: Do not edit
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { CheckboxItem, ButtonItem } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cart'
import fetch from '@utils/request'
import { POST_CART_ORDER } from '@constants/api'
import './index.scss'

@connect(state => ({...state.cart, ...state.global}) , { ...actions }) 
export default class Footer extends Component {
  state = {
    ProductList:[],
    SelectCart: [],
    AllCheck: false,
    TotalPrice: 0
  }

  async componentDidMount(){
    const { cartInfo } = this.props
    await this.setState({ ProductList: cartInfo }) 
    await this.getSelectArray()
  }

  async componentWillReceiveProps(nextProps){
    const { cartInfo } = nextProps
    await this.setState({ ProductList:cartInfo })
    await this.getSelectArray()
  }

  async getSelectArray(){
    const { cartInfo } = this.props
    let TotalPrice = 0
    const SelectCart = []
    if (cartInfo && cartInfo.length) {
      for (let index = 0; index < cartInfo.length; index++) {
        const element = cartInfo[index];
        const { Amount, Price, checked } = element
        if (element && checked) {
          const SinCartPrice = parseInt(Amount,10) * parseInt(Price,10)
          TotalPrice += SinCartPrice
          SelectCart.push(element)
        }
      }
      await this.setState({SelectCart, TotalPrice})
      if (SelectCart && SelectCart.length !== cartInfo.length) {
        await this.setState({AllCheck: false})
      } else if(SelectCart.length === cartInfo.length){
        await this.setState({AllCheck: true})
      }
    } 
  }

  handleUpdateCheck = async () => {
    const { dispatchUpdateCheck, isUpdate } = this.props
    const { AllCheck } = this.state
    const { ProductList } = this.state
    const NewList = ProductList
    ProductList.map((item, index)=>{
      NewList[index].checked = !AllCheck 
    })
    await this.setState({AllCheck: !AllCheck})
    await dispatchUpdateCheck({ NewList, isUpdate:!isUpdate})
  }

  handleOrder = async () => {
    const { SelectCart } = this.state
    if (!SelectCart || !SelectCart.length) {
      wx.showToast({
        title: '您还没有选择商品呢～',
        icon: 'none'
      })
      return;
    }
    
    // todo : showloading
    wx.showLoading({title:'系统处理中', mask:true})
    // 提交订单
    const Rorder = await this.SubmitOrder();
    if (!Rorder) return await wx.hideLoading()
    // 跳转页面 ，携带orderId
    
  }

  SubmitOrder = async () => {
    console.log('submit order');
    const { userinfo, cartParentId, onAllOrdered } = this.props
    const { SelectCart, TotalPrice } = this.state  

    const params = {}
    params.Login = true
    params.method = "POST"
    params.pureReturn = true
    params.url = POST_CART_ORDER
    try {
        const { Mobile,Id:UserId } = userinfo
        if (!Mobile) throw new Error('请先注册个人信息')
        
        // type = 1 : 服务下单；
        const payload = { Mobile, SelectCart:JSON.stringify(SelectCart), TotalPrice, UserId, Type: 1, cartParentId }  

        const result = await fetch({...params, payload})
        const { success, data, message } = result 
        if (!success) throw new Error(message)
        
        // 更新商品列表：已购买的不再显示
        if(success){
          await onAllOrdered()
        } 
        await wx.hideLoading()

        return data // { Code, OrderId  }
    } catch (error) {
        const { message: title } = error
        Taro.showToast({ title, icon: 'none' })
        console.error(error)
        return false
    }
}

  render () {
    const { TotalPrice, AllCheck, SelectCart } = this.state
    return (
      <View className='cart-footer'>
        <View className='cart-footer__select'>
          <CheckboxItem
            checked={AllCheck}
            onClick={this.handleUpdateCheck}
          >
            <Text className='cart-footer__select-txt'>
              {AllCheck ? '全选' : `已选(${SelectCart ?  SelectCart.length: 0})`}
            </Text>
          </CheckboxItem>
        </View>
        <View className='cart-footer__amount'>
          <Text className='cart-footer__amount-txt'>
            ¥{parseFloat(TotalPrice).toFixed(2)}
          </Text>
        </View>
        <View className='cart-footer__btn'>
          <ButtonItem
            type='primary'
            text='下单'
            onClick={this.handleOrder}
          />
        </View>
      </View>
    )
  }
}
