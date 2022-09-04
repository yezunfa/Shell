import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import { ClSearchBar, ClSwiper } from "mp-colorui"
import { AtGrid } from "taro-ui"
import icons from './assets'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as globalactions from '@actions/global'
import { Login } from '@utils/wechat'
import HomeContainer from './homeContainer/index'
import { getWindowHeight } from '@utils/style'
import { ListNavGridTo } from './constants'
import './home.scss'

@connect(({global}) => ({...global}),{...globalactions})
class Home extends Component {
  config = {
    navigationBarTitleText: '贝壳口腔'
  }

  state = {
    loaded: true,
    loading: false,
  }

  Pictures = [
    {url: 'https://assets.51fusion.com/1d40604d-2bc8-42df-bc33-3bccb5e0cb5b.png'},
    {url: 'https://assets.51fusion.com/39aed86d-0a40-4335-935e-25939d2a6c6a.png'},
    {url: 'https://assets.51fusion.com/b2b9a97e-9cd9-41f3-abe4-2427fd448482.png'},
  ]

  async componentDidShow() { // 111
    await this.wechatLogin()  // 首页登陆获取用户id
    Taro.showShareMenu({
      withShareTicket:true,
      //设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
      menus:["shareAppMessage","shareTimeline"]
  })
  }

  onShareAppMessage () {
    return {
      title: '赣州贝壳口腔门诊部',
      desc: '卓越医疗，温暖服务!!',
      path: '/pages/home/home',
      imageUrl: 'https://assets.51fusion.com/1afa4357-37a3-41a5-b47b-cb39fc0d6f7c.png'
    }
  }
  //用户点击右上角分享朋友圈, todo,
  // 目前微信只支持安卓版本
  onShareTimeline() {
    return {
      title: '赣州贝壳口腔门诊部',
      // desc: '卓越医疗，温暖服务!',
      // path: '/pages/home/home',
      imageUrl: 'https://assets.51fusion.com/1afa4357-37a3-41a5-b47b-cb39fc0d6f7c.png'
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

  onSearch = value => {
    Taro.showToast({
      title: `您搜索了${value},暂不支持此功能`,
      icon: 'none'
    })
  }

  navTo = (item, index) => {
    // todo: 各项导航页面的调整 
    // console.log(item, index)
    const { url, type, message } = ListNavGridTo[index]
    if (!url) return Taro.showToast({ title: message, icon: 'none' })
    if (type === 'tab') return Taro.switchTab({ url })
    if (type === 'page') return Taro.navigateTo({ url })
    
  }

  renderStoreDescription = () => {
    const { timeIcon, logoIcon, descIcon, contactIcon } = icons
    return (
      <View>
        <HomeContainer title='精品推荐'>
          <View className='imageContainer'>
            <View className='activityView' onClick={() => {
                      // console.log('item', item)
                      Taro.navigateTo({ url: `/pages/product/index?Id=45fc7f15-c02d-414c-a1e9-3adb643aa70b` })   // 舒适洁牙
                    }}>
              <Image className='activityImage'   src='https://assets.51fusion.com/7b8f2279-87c3-46e7-8dcf-1198f2b7ba23.png' />
            </View>
            <View className='activityView'
                onClick={() => {
                      // console.log('item', item)
                      Taro.navigateTo({ url: `/pages/product/index?Id=qw4cqw51-2fb7-47b4-b26d-72d28e17e053` })
                    }}>
              <Image className='activityImage'   src='https://assets.51fusion.com/080a4f48-87e4-4890-b777-d433a10fa00a.png' />
            </View>
          </View>
        </HomeContainer>
        <HomeContainer title='商户介绍'>
          <View className='container'>
            <View className='flex-row'>
              <View><Image className='icon' src={timeIcon} /></View>
              <View className='line'>营业时间: 8:00 - 22:00</View>
            </View>
            <View className='flex-row'>
               <View><Image className='icon' src={contactIcon} /></View>
              <View className='line'>联系我们: 0797-8068628</View>
            </View>
            <View className='flex-row'>
              <View><Image className='icon' src={logoIcon} /></View>
              <View className='line tag-border'>WI-FI</View>
              <View className='line tag-border'>停车场</View>
              <View className='line tag-border'>微信支付</View>
              <View className='line tag-border'>支付宝支付</View>
            </View>
            <View className='flex-row'>
              <View><Image className='icon' src={descIcon} /></View>
              <View className='line'>商家介绍</View>
            </View>
            <View className='imageContainer'>
              <View className='activityView'>
                <Image className='activityImage'  src='http://cdn.shuaixiaoxiao.com/image/20200630015150.jpg' />
              </View>
            </View>
            <View className='flex-row'>
              贝壳口腔门诊部是一家全方位现代化口腔医疗机构，以预防
              口腔疾病为主，并同时开展牙周预防、儿童牙科、口腔正畸
              、美学修复、综合治疗等口腔医疗项目。门诊以做最温暖的
              医疗企业为愿景秉承卓越医疗与温暖服务相结合的经营理念
              ，不断引进国际先进技术和诊断理念，让更多人拥有健康口
              腔、绽放自信笑容。
            </View>
          </View>
        </HomeContainer>
        <HomeContainer title='店铺照片'>
          <Swiper
            displayMultipleItems={3}
            >
            <SwiperItem>
              <Image className='storeImages' mode='aspectFit' src='http://cdn.shuaixiaoxiao.com/image/20200630020338.jpg' />
            </SwiperItem>
            <SwiperItem>
              <Image className='storeImages' mode='aspectFit' src='http://cdn.shuaixiaoxiao.com/image/20200630020420.jpg' />
            </SwiperItem>
            <SwiperItem>
              <Image className='storeImages' mode='aspectFit' src='http://cdn.shuaixiaoxiao.com/image/20200630020446.jpg' />
            </SwiperItem>
            <SwiperItem>
              <Image className='storeImages' mode='aspectFit' src='http://cdn.shuaixiaoxiao.com/image/20200630020514.jpg' />
            </SwiperItem>
            <SwiperItem>
              <Image className='storeImages' mode='aspectFit' src='http://cdn.shuaixiaoxiao.com/image/20200630020539.jpg' />
            </SwiperItem>
            <SwiperItem>
              <Image className='storeImages' mode='aspectFit' src='http://cdn.shuaixiaoxiao.com/image/20200630020623.jpg' />
            </SwiperItem>
            <SwiperItem>
              <Image className='storeImages' mode='aspectFit' src='http://cdn.shuaixiaoxiao.com/image/20200630020651.jpg' />
            </SwiperItem>
          </Swiper>
        </HomeContainer>
      </View>
    )
  }

  renderIconList = () => {
    return (
      <AtGrid  columnNum={3} onClick={this.navTo.bind(this)} data={
        [
           {
             image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
             value: '新人专项'
           },
           {
             image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
             value: '限时秒杀'
           },
           {
             image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
             value: '最新活动'
           },
           {
            image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
            value: '会员中心'
           },
           {
             image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
             value: '经典案例'
           },
           {
            image: 'https://assets.51fusion.com/2eaae996-ba5f-47d7-bfa1-f3e5fc2ac09c.png',
            value: '专家团队'
          }
         ]
       } />
    )
  }
 
  render () {
    const { loaded } = this.state
    if (!loaded) {
      return <Loading />
    }
    // test push
    return (
      <View className='home'>
        {/* <View className='home__search'>
          <ClSearchBar
              shape='round'
              rightButtonColor='black'
              rightTextColor='white'
              placeholder='请输入你想输入的内容'
              leftIcons={[
                'emoji'
              ]}
              onIconClick={(index) => {
                Taro.showToast({
                  title: `您点击了第${index + 1}个图标`,
                  icon: 'none'
                })
              }}
              onSearch={value => {
                this.onSearch(value)
              }}
            />
          </View> */}
        <ScrollView
          scrollY
          className='home__wrap'
          style={{ height: getWindowHeight() }}
        >
          <ClSwiper
            type='screen'
            list={this.Pictures}
            autoplay
            circular
            dot='round'
            indicatorDots
            indicatorColor='#8799a3'
            indicatorActiveColor='#0081ff'
          />
          {this.renderIconList()}
          {this.renderStoreDescription()}
          {/* <View className='home__bottonTip flex-row-space-center'>
            ——马丁鱼科技有限公司提供技术支持——
          </View> */}
        </ScrollView>
      </View>
    )
  }
}

export default Home
