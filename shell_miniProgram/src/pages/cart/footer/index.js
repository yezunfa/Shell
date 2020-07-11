/*
 * @Author: yezunfa
 * @Date: 2019-07-22 16:56:19
 * @LastEditTime: 2020-07-09 13:29:02
 * @Description: Do not edit
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { CheckboxItem, ButtonItem } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cart'
import fetch from '@utils/request'
import { POST_CART_ORDER, POST_SUBMIT_WECHAT_PAY, POST_ORDER_PAYMENTCANCEL } from '@constants/api'
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
          const SinCartPrice = parseInt(Amount,10) * parseFloat(Price,10)
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
    const { onAllOrdered } = this.props
    const { SelectCart } = this.state
    if (!SelectCart || !SelectCart.length) {
      wx.showToast({
        title: '您还没有选择商品呢～',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({title:'系统处理中', mask:true})
    // 提交订单
    const Rorder = await this.SubmitOrder();
    if (!Rorder) return await wx.hideLoading()
    // 跳转页面 ，携带orderId
    Taro.navigateTo({ url: `/pages/order-check/index?Id=${Rorder.OrderId}` })
    
    
    // console.log(Rorder)    
    // todo：跳转支付确认页面
    // 暂时在此处做一下微信支付的逻辑
    
    // const Rwechatpay = await this.wxPaySummit(Rorder);
    //   if (!Rwechatpay){
    //       await this.deleteOrder(Rorder)  // 删除订单、修改购物车选品状态
    //       return await wx.hideLoading()
    //   }
    // console.log(Rwechatpay)

    // 更新商品列表：已购买的不再显示,未购买成功的恢复列表
    // await onAllOrdered()
    


  }

  SubmitOrder = async () => {
    console.log('submit order');
    const { userinfo, cartParentId } = this.props
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
        
        return data // { Code, OrderId  }
    } catch (error) {
        const { message: title } = error
        Taro.showToast({ title, icon: 'none' })
        console.error(error)
        return false
    }
  }

    /**
     * 将微信支付的返回值放到payinfo带上到后端
     * 微信支付，选择支付成功，再提交到我们的后台进行支付成功
     * {"success":true,"code":200,"data":{"return_code":"FAIL","return_msg":"out_trade_no参数长度有误"},"errorMessage":""}
     * @param {string} orderId 生成的订单编号
     */
    async wxPaySummit({ OrderId, Code:OrderNo }){
      const { userinfo } = this.props;
      const { openid } = userinfo
      console.log('wechat payment');
      try {
          const url = POST_SUBMIT_WECHAT_PAY
          const payload = { orderId: OrderId, openid }

          const result = await fetch({url, payload, pureReturn: true, method: 'POST' });
          console.log(result)
          if(!result || !result.data) throw new Error('微信订单服务错误')
          if(!result.data.appId) throw new Error('微信订单签名异常')

          const paymentresult = await Taro.requestPayment(result.data);
          console.log(paymentresult)
          if (!paymentresult || !paymentresult.errMsg) throw new Error('微信支付接口异常') 

          const { errMsg } = paymentresult

          if (errMsg === 'requestPayment:fail') throw new Error('微信支付失败')
          if (errMsg === 'requestPayment:fail cancel') throw new Error('用户已取消支付')
          if (errMsg !== 'requestPayment:ok') throw new Error(errMsg)

          return paymentresult
      } catch (error) {
          const { message: title } = error
          Taro.showToast({ title, icon: 'none' })
          console.error(error)
          return false
      }
  }

  async deleteOrder({OrderId}){
    console.log('订单取消')
    const params = {}

    params.method = "POST"
    params.pureReturn = true
    params.url = POST_ORDER_PAYMENTCANCEL
    try {

        const payload = { OrderId }  

        const result = await fetch({...params, payload})
        const { success, data, message } = result 
        if (!success) throw new Error(message)
    } catch (error) {
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
