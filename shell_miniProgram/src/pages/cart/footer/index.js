/*
 * @Author: yezunfa
 * @Date: 2019-07-22 16:56:19
 * @LastEditTime: 2020-07-05 13:11:10
 * @Description: Do not edit
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { CheckboxItem, ButtonItem } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cart'
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

  handleOrder = () => {
    Taro.showToast({
      title: '敬请期待',
      icon: 'none'
    })
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
              {AllCheck ? '全选' : `已选(${SelectCart.length})`}
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
