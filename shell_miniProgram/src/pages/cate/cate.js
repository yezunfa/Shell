import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { ClSearchBar, ClVerticalTab, ClVerticalTabCell } from "mp-colorui";
// import * as actions from '@actions/cate'
import { getWindowHeight } from '@utils/style'
import './cate.scss'

const tabs = [...Array(50)].map((key, index) => ({name: 'tab-' + index, id: 'id-' + index}))
// @connect(state => state.cate, { ...actions })
class Cate extends Component {
  config = {
    navigationBarTitleText: '项目分类'
  }

  state = {
  }

  componentDidMount() {
    
  }

  render () {
    const height = getWindowHeight()

    return (
      <View className='cate'>
        <ClSearchBar
            shape='round'
            placeholder='请搜索你需要的服务项目'
            searchType='none'
            onTouchResult={(index) => {
              Taro.showToast({
                title: `您点击了${index}`,
                icon: 'none'
              })
            }}
          />
        <View style={{height:`${height}`}}>
            <ClVerticalTab tabs={tabs} height={'full'}>
            <View>
              {tabs.map((item) => (
                <View id={item.id} key={item.name}>
                  <ClVerticalTabCell>{item.name}</ClVerticalTabCell>
                </View>
              ))}
            </View>
          </ClVerticalTab>
        </View>
        
      </View>
      
    )
  }
}

export default Cate
