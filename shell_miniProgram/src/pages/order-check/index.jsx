import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GET_ORDER_DETAIL, POST_SUBMIT_WECHAT_PAY, POST_ORDER_EDIT } from '@constants/api'
import fetch from '@utils/request'
import Products from './products'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui'

import StoreAddressPick from './store-address-pick'
import UserInfo from './user-info'
import PayMethod from './pay-method'

import './index.scss'

@connect(state => ({ ...state.global }) )
class Index extends Component {

    state = {
        loaded: false,
        OrderSubList: [], 
        OrderMain: {},
        submitData: {}
    }

    componentDidMount = async () => {
        // /api/order/detail
        this.getDetail()
    }

    asyncSetState = async state => new Promise(resolve => { this.setState(state, (res => { res({ message: '更新完成', state }) }).bind(this, resolve)) })

    setFormState = async ({ key, value }) => {
        const { submitData } = this.state
        submitData[key] = value
    }

    getDetail = async () => {
        await this.asyncSetState({ loaded: false })
        const { Id } = this.$router.params
        const payload = { Id }
        const params = {
            url: GET_ORDER_DETAIL,
            payload
        }
        try {
            const response = await fetch(params)
            if (!response) return Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
            const { OrderSubList, OrderMain } = response
            await this.asyncSetState({ OrderSubList, OrderMain })
        } catch (error) {
            Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
        }
    }

    handleSubmit = async () => {
        const { OrderMain, submitData } = this.state
        
        // 装填待提交的数据
        const [Rorder, info] = [{
            OrderId: OrderMain.Id,
            Code: OrderMain.Code,
        }, {
            Id: OrderMain.Id,
            LinkName: submitData.UserName,
            LinkMobile: submitData.UserMobile,
            Remark: submitData.Message,
        }]
        
        const res = await Taro.showModal({ title: '提示', content: '确定提交？'})
        Taro.showLoading({ title: '支付中' })
        if (res.confirm) {
            // 持久化用户填写的信息
            const Retres = await this.orderSubmit(info)
            if (!Retres.success) {
                Taro.hideLoading()
                return Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
            }
            // 发起支付
            const Rwechatpay = await this.wxPaySummit(Rorder)
            // 支付失败则删除订单
            if (!Rwechatpay){
                Taro.hideLoading()
                return await this.deleteOrder(Rorder)  // 删除订单、修改购物车选品状态
            }
        }
    }

    orderSubmit = async (data) => {
        const payload = { ...data }
        const params = {
            method: 'POST',
            url: POST_ORDER_EDIT,
            payload,
            pureReturn: true
        }
        try {
            const response = await fetch(params)
            if (!response.success) return Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
            return response;
        } catch (error) {
            console.log(error)
            Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
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

    /**
     * 将微信支付的返回值放到payinfo带上到后端
     * 微信支付，选择支付成功，再提交到我们的后台进行支付成功
     * {"success":true,"code":200,"data":{"return_code":"FAIL","return_msg":"out_trade_no参数长度有误"},"errorMessage":""}
     * @param {string} orderId 生成的订单编号
     */
    async wxPaySummit({ OrderId, Code: OrderNo }){
        const { userinfo } = this.props;
        const { openid } = userinfo
        console.log('wechat payment');
        try {
            const url = POST_SUBMIT_WECHAT_PAY
            const payload = { orderId: OrderId, openid }
  
            const result = await fetch({url, payload, pureReturn: true, method: 'POST' });
            if(!result || !result.data) throw new Error('微信订单服务错误')
            if(!result.data.appId) throw new Error('微信订单签名异常')
  
            const paymentresult = await Taro.requestPayment(result.data);
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

    render () {
        const { OrderSubList, OrderMain, submitData } = this.state
        return (
            <View className='order'>
                <View>
                    <Products productData={OrderSubList} orderData={OrderMain} />
                </View>
                <View className='order__component'>
                    <StoreAddressPick />
                </View>
                <View className='order__component'>
                    <UserInfo submitData={submitData} setFormState={this.setFormState} />
                </View>
                <View className='order__component'>
                    <PayMethod />
                </View>
                <View className='order__component button'>
                    <AtButton type='primary' full onClick={this.handleSubmit}>确定支付</AtButton>
                </View>
            </View>
        )
    }

}

export default Index