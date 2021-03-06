import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as globalactions from '@actions/global'
import { Popup, Loading, Spec, Mongolia } from '@components'
import { 
    GET_PRODUCT_DETAIL,
    POST_CREATE_CART_PRODUCT,
    API_GET_PRODUCT_QRCODE
} from '@constants/api'
import { uuid_decompression } from '@utils/methods'
import { Login } from '@utils/wechat'
import { getWindowHeight } from '@utils/style'
import fetch from '@utils/request'
import Gallery from './gallery'
import InfoBase from './info-base'
import InfoParam from './info-param'
import Footer from './footer'
import Detail from './detail'
import NewQrcode from './new-qrcode'
import './index.scss'

const baseClass = 'page'

@connect(({global}) => ({...global}),{...globalactions})
class Index extends Component {

    state = {
        loaded: false,
        productInfo: {},
        gallery: [],
        visible: false,
        // qrcode: null,
        switchs: {},
    }

    componentDidMount() {
        this.getDetail()
        Taro.showShareMenu({
            withShareTicket:true,
            //设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
            menus:["shareAppMessage","shareTimeline"]
        })
    }

    async componentDidShow() {
        const { userinfo } = this.props
        if (!userinfo || !userinfo.Id) {
            await this.wechatLogin()  // 获取用户id
        }
        // const url = `${API_GET_PRODUCT_QRCODE}?scene=${uuid_compression(userinfo.Id)}`
        // const qrcode = await fetch({ url }) // 获取签到二维码
        // await this.asyncSetState({ qrcode })
    }

    onShareAppMessage () {
        const { productInfo } = this.state
        return {
          title: '赣州贝壳口腔门诊部',
          desc: '卓越医疗，温暖服务!',
          path: `/pages/product/index?Id=${productInfo.Id}`,
          imageUrl: `${productInfo.primaryPicUrl}`
        }
      }
    
    onShareTimeline() {
        console.log('是否点击了分享朋友圈')
        const { productInfo } = this.state
        return {
            title: `${productInfo.Name},活动期仅需${productInfo.Price}元，快来抢购吧～ `,
            query: `Id=${productInfo.Id}`,
            imageUrl: `${productInfo.primaryPicUrl}`
        }
    }
        /**
     * 登录事件
     * @param {*} params 
     */
    async wechatLogin(params = {}) {
    const { dispatchUserInformation } = this.props
    try {
        await Taro.showLoading({title:'加载中～', mask:true })
        //  await Taro.showLoading({title: '更新用户信息', mask: true})
        const { scene, userdata, redirect, redirectparams } = params
        const response = await Login({scene, userdata}) // 登录
        if (response.code === 200 ) {
            const { userinfo } = response.data
            await dispatchUserInformation({ ...userinfo })
        }
        // 更新用户信息
        await Taro.hideLoading()
    } catch (error) {
        console.error(error)
        const icon = 'none'
        const title = "网络异常, 请刷新重试"
        // await Taro.hideLoading()
        Taro.showToast({icon, error})
    }
    }

    asyncSetState = async state => new Promise(resolve => { this.setState(state, (res => { res({ message: '更新完成', state }) }).bind(this, resolve)) })

    getDetail = async () => {
        await this.asyncSetState({ loaded: false })
        const { Id, scene } = this.$router.params
        let SceneId = ''
        if (!Id) {
            SceneId = uuid_decompression(scene)
        }
        const payload = { Id: Id ? Id : SceneId }
        const params = {
            url: GET_PRODUCT_DETAIL,
            payload
        }
        try {
            const response = await fetch(params)
            const { Id: ProductId, Name, Introduce, Price, BannerList, Summary, Notice, Detail: _Detail } = response
            await this.asyncSetState({ 
                productInfo: {
                    Id: ProductId,
                    // name: Name,             // 产品名
                    simpleDesc: Introduce,  // 产品介绍
                    // activityPrice: Price,   // 产品现价
                    Price,
                    Name,
                    BannerList,
                    retailPrice: parseFloat(Price),     // 产品原价
                    itemStar: { goodCmtRate: 99 },                   // 产品好评率
                    tagList: [ {tagName: '医生超好'}, {tagName:'性价比高'}, {tagName:'环境不错'} ],     //产品标签
                    attrList: [ 
                        { attrName: '适用情况', attrValue: Summary },
                        { attrName: '注意事项', attrValue: Notice } 
                    ],
                    primaryPicUrl: JSON.parse(BannerList)[0],   // 小图
                    skuSpecList: [
                        {id: 'group1', name: 'group1', skuSpecValueList: [ 
                            { id: 'group1-item1', name: 'group1-name1', value: 'group1-value1' },
                            { id: 'group1-item2', name: 'group1-name2', value: 'group1-value2' },
                            { id: 'group1-item3', name: 'group1-name3', value: 'group1-value3' },
                        ]},
                        {id: 'group2', name: 'group2', skuSpecValueList: [ 
                            { id: 'group2-item1', name: 'group2-name1', value: 'group2-value1' },
                            { id: 'group2-item2', name: 'group2-name2', value: 'group2-value2' },
                            { id: 'group2-item3', name: 'group2-name3', value: 'group2-value3' },
                        ]},
                        {id: 'group3', name: 'group3', skuSpecValueList: [ 
                            { id: 'group3-item1', name: 'group3-name1', value: 'group3-value1' },
                            { id: 'group3-item2', name: 'group3-name2', value: 'group3-value2' },
                            { id: 'group3-item3', name: 'group3-name3', value: 'group3-value3' },
                        ]}
                    ], // 规格类型
                    productDetail: _Detail                      // html格式，数据库改变数据即可改变商品的详情，这里我只放了一些图片
                },
                gallery: JSON.parse(BannerList),        // 产品画廊，轮播图的形式
                loaded: true
            })
        } catch (error) {
            console.log(error);
            Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
        }
    }

    // 关闭选择框，并清空当前组件中保存的产品规格数量信息
    toggleVisible = async () => {
        await this.asyncSetState({ visible: !this.state.visible, selected: {} })
    }

    // 选择规格
    handleSelect = async (selected) => {
        await this.asyncSetState({ selected })
    }

    handleAdd = async () => {
        await this.asyncSetState({ visible: true });
    }

    // 添加到购物车中，入库
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
        if (response) {
            await Taro.showToast({ title: '成功加入购物车', icon: 'success', duration:1500 });
            return await Taro.switchTab({ url: "/pages/cart/cart" });
            
            
        } 
        return Taro.showToast({ title: '服务器繁忙，请重试', icon: 'none' })
    }

    // 控制二维码窗口的打开/关闭
    Qrcode = async (qrcode = true) => {
        const { switchs } = this.state
        const newSwitchs = { ...switchs, qrcode }
        this.setState({ switchs: newSwitchs })
    }

    render() {
        const { productInfo={}, gallery, visible, selected, switchs, qrcode } = this.state
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
                        <InfoBase data={productInfo} onOpenCode={this.Qrcode}/>
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
                        onSelect={this.handleSelect}   // 选规格的
                        onAddCart={this.handleAddCart}  // 加入购物车(入库)
                    />
                </Popup>
                <View className='page__footer'>
                    <Footer onAdd={this.handleAdd} />
                </View>
                {<Mongolia show={!!switchs.qrcode}>
                    {/* <ModalQRcode 
                        qrcode={qrcode} 
                        list={memberlist} 
                        onClose={()=>this.Qrcode(false)}
                        title={`预约签到: ${sign.membersign}/${memberlist.length}`}
                    /> */}
                    <NewQrcode 
                        // qrcode={qrcode} 
                        data={productInfo}
                        // list={memberlist} 
                        onClose={()=>this.Qrcode(false)}
                        title={`商品分享二维码`}
                    />
                </Mongolia>}
            </View>
        )
    }
}

export default Index
