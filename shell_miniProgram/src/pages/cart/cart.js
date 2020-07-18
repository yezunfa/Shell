import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components' 
import { getWindowHeight } from '@utils/style'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cart'
// import Empty from './empty'
import Empty from '@components'
import List from './list'
import Footer from './footer'
import './cart.scss'

@connect(state => ({...state.cart, ...state.global}) , { ...actions }) 
class Index extends Component {
  config = {
    navigationBarTitleText: '购物车'
  }

  state = {
    loaded: false,
    isShowFooter: false,
    isEmpty: true,
  }

  async componentDidShow() {
    await this.getData()
  }

  async componentWillReceiveProps(nextProps){
    const { cartInfo } = nextProps
    await this.setState({ProductList: cartInfo})
  }

  async getData(){
    const { dispatchCart  } = this.props
    await dispatchCart()
    await this.setDefaultData()
  }  

  async setDefaultData(){
    const { cartInfo } = this.props
    if (cartInfo && cartInfo.length) {
      await this.setState({
        ProductList: this.props.cartInfo,
        isEmpty:false,
        isShowFooter: true
      })
    } else {
      await this.setState({
        ProductList: [],
        isEmpty:true,
        isShowFooter: false
      })
    }
  }

  render () {
    const { isShowFooter, isEmpty, ProductList } = this.state
    return (
      <View className='cart'>
        <ScrollView  scrollY  className='cart__wrap'  style={{ height: getWindowHeight() }} >
          {isEmpty && <Empty/> }
          <List ProductList={ProductList} />
        </ScrollView>
        {isShowFooter &&
          <View className='cart__footer'>
            <Footer onAllOrdered={() => this.getData()}/> 
          </View>
        }
      </View>
    )
  }
}

export default Index
