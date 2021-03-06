import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { ThemeButton, Product } from '@components'
import { OrderPayStateEnum, OrderStateEnum } from '@constants/order'
import icons from '@assets'

import './index.scss'

const baseClass = 'verbTabsComponent'
class Index extends Component {

    handleDetail = () => {
        const { data } = this.props
        Taro.navigateTo({ url: `/pages/invoice/index?OrderMainId=${data.Id}&SysUser=1` })
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
        return (
            <View className={`${baseClass}`}>
                <View className={`${baseClass}_titleView flex-row-space-between`}>
                    <View className={`${baseClass}_titleView-left flex-row`}>
                        <Image className='icon' src={icons.store} />
                        <View className={`${baseClass}_titleView-left-storeName`}>用户:{LinkName}</View>
                        <Image className='small-icon' src={icons.more} />
                        <View className={`${baseClass}_titleView-left-storeName`}>{LinkMobile}</View>
                    </View>
                    <View className={`${baseClass}_titleView-right`}>
                        {/* {PayState !== undefined && OrderPayStateEnum.find(i => i.key === PayState).value} */}
                        {State !== undefined && OrderStateEnum.find(i => i.key === State).value}
                    </View>
                </View>
                <View className={`${baseClass}-containerView`}>
                    {child && child.length !== 0 && child.map(item => {
                        return <Product item={{ ...item }} />
                    })}
                </View>
                <View className={`${baseClass}-priceView flex-row-space-right`}>
                    <View>已支付:￥{TotalPrice}</View>
                    {/* <View>优惠￥5.0</View> */}
                    {/* <View>实付款114.0</View> */}
                </View>
                <View className={`${baseClass}-bottomView flex-row-space-right`}>
                    {/* {PayState !== undefined && PayState === 0 && <ThemeButton onClick={this.handleClick} text='去支付' />} */}
                    {PayState !== undefined && PayState === 1 && <ThemeButton onClick={this.handleDetail} text='详情' />}
                    {/* {PayState !== undefined && PayState === 4 && <ThemeButton text='去评价' />} */}
                </View>
            </View>
        )
    }

}

export default Index