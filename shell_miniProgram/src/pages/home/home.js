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
    {url: '//assets.51fusion.com/8650769d-3fe9-4b64-8535-dddc89c3b495.png'},
    {url: '//assets.51fusion.com/5bddbf4e-5b3a-4402-8ec3-1ed1983fc958.png'},
    {url: '//assets.51fusion.com/f60048bd-82ac-41f9-9161-e75a587cbc6a.png'},
    {url: '//assets.51fusion.com/1afa4357-37a3-41a5-b47b-cb39fc0d6f7c.png'}
  ]

  async componentDidMount() {
    await this.wechatLogin()  // 首页登陆获取用户id
  }

      /**
   * 登录事件
   * @param {*} params 
   */
  async wechatLogin(params = {}) {
    const { dispatchUserInformation } = this.props
    try {
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
        Taro.showToast({icon, title})
    }
  }

  onSearch = value => {
    Taro.showToast({
      title: `您搜索了${value}`,
      icon: 'none'
    })
  }

  renderStoreDescription = () => {
    const { timeIcon, logoIcon, descIcon } = icons
    return (
      <View>
        <HomeContainer title='精品推荐'>
          <View className='activityContainer'>
            <View className='activityView'><Image className='activityImage' mode='aspectFit' src='http://cdn.shuaixiaoxiao.com/image/20200630012907.jpg' /></View>
            <View className='activityView'><Image className='activityImage' mode='aspectFit' src='http://cdn.shuaixiaoxiao.com/image/20200630013228.jpg' /></View>
          </View>
        </HomeContainer>
        <HomeContainer title='商户介绍'>
          <View className='container'>
            <View className='flex-row'>
              <View><Image className='icon' src={timeIcon} /></View>
              <View className='line'>9:00 - 18:00</View>
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
            <View className='flex-row'>
              <Image mode='aspectFit' src='http://cdn.shuaixiaoxiao.com/image/20200630015150.jpg' />
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
      <AtGrid hasBorder={false} columnNum={4} data={
        [
           {
             image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
             value: '领取中心'
           },
           {
             image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
             value: '找折扣'
           },
           {
             image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
             value: '领会员'
           },
           {
             image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
             value: '新品首发'
           },
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
        <View className='home__search'>
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
          </View>
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
          <View className='home__bottonTip flex-row-space-center'>
            ——马丁鱼科技有限公司提供技术支持——
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default Home
