import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { ThemeButton, Product } from '@components'
import { OrderPayStateEnum, OrderStateEnum } from '@constants/order'
import icons from '@assets'

import './index.scss'

const baseClass = 'verbTabsComponent'
class Index extends Component {

    handleClick = () => {
        const { data } = this.props
        Taro.navigateTo({ url: `/pages/order-check/index?Id=${data.Id}` })
    }

    productRefresh = () => {
        const { refresh } = this.props
        refresh && refresh()
    }

    handleAllWriteOff = async (surplusCount) => {
        const res = await Taro.showModal({ title: '核销确认', content: `确定核销剩余的${surplusCount}个商品？` })
        if (res.confirm) console.log('同意')
    }

    render () {
        const { data={} } = this.props
        const {
            Id,
            CreateTime,
            Mobile,
            LinkMobile,
            LinkName,
            Name,
            PayState,
            TotalPrice,
            State,
            Type,
            child
        } = data
        const surplusCount = child && child.length && child.reduce((surplus, item) => {
            // 未使用的order_sub
            if (item.State === 0) return surplus + item.Count
            return surplus
        }, 0)
        return (
            <View className={`${baseClass}`}>
                <View className={`${baseClass}_titleView flex-row-space-between`}>
                    <View className={`${baseClass}_titleView-left flex-row`}>
                        <Image className='icon' src={icons.store} />
                        <View className={`${baseClass}_titleView-left-storeName`}>贝壳口腔</View>
                        <Image className='small-icon' src={icons.more} />
                    </View>
                    {/* <View className={`${baseClass}_titleView-right`}>
                        {PayState !== undefined && OrderPayStateEnum.find(i => i.key === PayState).value}
                        {State !== undefined && OrderStateEnum.find(i => i.key === State).value}
                    </View> */}
                </View>
                <View className={`${baseClass}-containerView`}>
                    {child && child.length !== 0 && child.map(item => {
                        return <Product refresh={this.productRefresh} item={{ ...item }} model='writeOff' />
                    })}
                </View>
                <View className={`${baseClass}-priceView flex-row-space-right`}>
                    <View>总价￥{TotalPrice}</View>
                    {/* <View>优惠￥5.0</View> */}
                    {/* <View>实付款114.0</View> */}
                </View>
                <View className={`${baseClass}-bottomView flex-row-space-right`}>
                    <ThemeButton disable={surplusCount <= 0 ? true : false} disableTopMsg='没有剩余的商品了哦~' onClick={() => { this.handleAllWriteOff(surplusCount) }} text='全部核销' />
                </View>
            </View>
        )
    }

}

export default Index