import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { getUserInfo } from '@utils/wechat';
import { POST_WECHAT_CRYP_DATA } from '@constants/api'
import fetch from '@utils/request'
import defaultAvatar from '@assets/default-avatar.png'
import bg from './assets/bg.png'
import qrCode from './assets/qr-code.png'
import level01 from './assets/level-01.png'
import './index.scss'

export default class Profile extends Component {
  static defaultProps = {
    userinfo: {}
  }

    /**
   * 用户同意手机号码解密并保存
   */
  async getPhoneNumber(e) {
      const userInfo = await getUserInfo();
      const { signature, rawData, code } = userInfo;
      if(e.detail.errMsg === 'getPhoneNumber:ok') {
          const res = await fetch({
              url: POST_WECHAT_CRYP_DATA, // 解密手机号
              method: "POST",
              pureReturn: true,
              payload: {
                  encryptedData: e.detail.encryptedData,
                  iv: e.detail.iv,
                  rawData,
                  signature,
                  js_code: code,
                  saveMobile: true // 同时将手机号保存到数据库
              }
          });
          if(!res || !res.success) {
              Taro.showToast({
                  title: '获取失败，请重试'
              })
              return;
          }
         // await Login() // 刷新数据
      } else {
          // 不允许用手机号
      }
  }

  render () {
    const { userinfo } = this.props
    return (
      <View className='user-profile'>
        {/* // NOTE 背景图片：Image 标签 + position absolute 实现 */}
        <Image
          className='user-profile__bg'
          src={bg}
          mode='widthFix'
        />

        <View className='user-profile__wrap'>
          <View className='user-profile__avatar'>
            <Image
              className='user-profile__avatar-img'
              src={userinfo.Avatar || defaultAvatar}
            />
          </View>

          <View className='user-profile__info' >
            <Text className='user-profile__info-name'>
              {userinfo.NickName}
            </Text>
            {userinfo.login ?
              <View className='user-profile__info-wrap'>
                {/* XXX 没有全部 level 对应的图标，暂时都用 v1 */}
                <Image className='user-profile__info-level' src={level01} />
                <Text className='user-profile__info-uid'>
                  'text'
                </Text>
              </View> :
              <View>
                 <Button className ="user-profile__info-tip" 
                 openType='getUserInfo'>
                   授权信息
                 </Button>
                 <Button className ="user-profile__info-tip" 
                 openType='getPhoneNumber' 
                 onGetPhoneNumber={this.getPhoneNumber}>
                   授权手机号
                 </Button>
              </View>
              
              
            }
          </View>

          <View className='user-profile__extra'>
            <View className='user-profile__extra-qr'>
              <Image
                className='user-profile__extra-qr-img'
                src={qrCode}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }
}
