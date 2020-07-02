import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { Popup, Loading } from '@components'
import { GET_PRODUCT_DETAIL } from '@constants/api'
import { getWindowHeight } from '@utils/style'
import fetch from '@utils/request'
import Gallery from './gallery'
import InfoBase from './info-base'
import InfoParam from './info-param'
import Footer from './footer'
import Detail from './detail'
import Spec from './spec'
import './index.scss'

const baseClass = 'page'

class Index extends Component {

    state = {
        loaded: false,
        productInfo: {},
        gallery: [],
        visible: false,
    }

    componentDidMount() {
        this.getDetail()
    }

    asyncSetState = async state => new Promise(resolve => { this.setState(state, (res => { res({ message: '更新完成', state }) }).bind(this, resolve)) })

    getDetail = async () => {
        await this.asyncSetState({ loaded: false })
        const { Id } = this.$router.params
        const payload = { Id }
        const params = {
            url: GET_PRODUCT_DETAIL,
            payload
        }
        const response = await fetch(params)
        // console.log(response)
        const { Name, Introduce, Price, BannerList, Summary, Notice, Detail: _Detail } = response
        await this.asyncSetState({ 
            productInfo: {
                name: Name,         // 产品名
                simpleDesc: Introduce,  // 产品介绍
                activityPrice: Price,   // 产品现价
                retailPrice: parseFloat(Price)+500,     // 产品原价
                itemStar: { goodCmtRate: 99 },                   // 产品好评率
                tagList: [ {tagName: '医生超好'}, {tagName:'性价比高'}, {tagName:'环境不错'} ],     //产品标签
                attrList: [ 
                    { attrName: '适用情况', attrValue: Summary },
                    { attrName: '注意事项', attrValue: Notice } 
                ],
                productDetail: _Detail                     // html格式，数据库改变数据即可改变商品的详情，这里我只放了一些图片
            },
            gallery: JSON.parse(BannerList),
            loaded: true
        })
    }

    toggleVisible = async () => {
        await this.asyncSetState({ visible: !this.state.visible, selected: {} })
    }

    handleSelect = async (selected) => {
        await this.asyncSetState({ selected })
    }

    handleAdd = () => {
        console.log('点击添加购物车');
    }

    render() {
        const { productInfo={}, gallery, visible, selected } = this.state
        const { productDetail } = productInfo
        const height = getWindowHeight(false)
        
        const popupStyle = process.env.TARO_ENV === 'rn' ?
        { transform: [{ translateY: Taro.pxTransform(-100) }] } :
        { transform: `translateY(${Taro.pxTransform(-100)})` }

        if (!this.state.loaded) {
            return <Loading />
        }

        return (
            <View className={`${baseClass}`}>
                <ScrollView
                    scrollY
                    className='page__wrap'
                    style={{ height }}
                    >
                        {/* 产品图列表 */}
                        <Gallery list={gallery} />
                        {/* 产品信息 */}
                        <InfoBase data={productInfo} />
                        {/* 产品参数 */}
                        <InfoParam list={productInfo.attrList} />
                        {/* 产品详情 */}
                        <Detail html={productDetail || ''} />
                </ScrollView>
                {/* 点击购买弹出的窗口 */}
                <Popup
                    visible={visible}
                    onClose={this.toggleVisible}
                    compStyle={popupStyle}
                >
                    <Spec
                        data={productInfo}
                        selected={selected}
                        onSelect={this.handleSelect}
                    />
                </Popup>
                <View className='page__footer'>
                    <Footer onAdd={this.handleAdd} />
                </View>
            </View>
        )
    }
}

export default Index
