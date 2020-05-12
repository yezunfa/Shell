import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { ClSearchBar, ClSwiper } from "mp-colorui"
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import { getWindowHeight } from '@utils/style'
import './home.scss'

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

  componentDidMount() {

  }

  onSearch = value => {
    Taro.showToast({
      title: `您搜索了${value}`,
      icon: 'none'
    })
  }
 
  render () {
    const { loaded, } = this.state
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
          
        </ScrollView>
      </View>
    )
  }
}

export default Home
