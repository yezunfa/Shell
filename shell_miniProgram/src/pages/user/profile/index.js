/*
 * @Author: yezunfa
 * @Date: 2019-07-22 16:56:19
 * @LastEditTime: 2021-01-17 17:36:43
 * @Description: Do not edit
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as globalactions from '@actions/global'
import { Register } from '@components'
import defaultAvatar from '@assets/default-avatar.png'
import bg from './assets/bg.png'
import logo from './assets/齿科.png'
import level01 from './assets/level-01.png'
import integration from './assets/integration.png'
import './index.scss'

@connect(({global}) => ({...global}),{...globalactions})
export default class Profile extends Component {
  static defaultProps = {
    userinfo: {}
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
              {userinfo.Name}
            </Text>
            {userinfo.Mobile ?
              <View className='user-profile__info-wrap'>
                {/* XXX 没有全部 level 对应的图标，暂时都用 v1 */}
                <Image className='user-profile__info-level' src={level01} />
                <Text className='user-profile__info-uid'>
                  {userinfo.Mobile}
                </Text>
              </View> :
              <View>
                 <Register/>
              </View>
              
              
            }
            {userinfo.Integration &&
              <View className='user-profile__info-wrap'>
                {/* XXX 没有全部 level 对应的图标，暂时都用 v1 */}
                <Image className='user-profile__info-level' src={integration} />
                <Text className='user-profile__info-uid'>
                  可用积分: {userinfo.Integration}
                </Text>
              </View> 
             }
          </View>

          <View className='user-profile__extra'>
            <View className='user-profile__extra-qr'>
              <Image
                className='user-profile__extra-qr-img'
                src={logo}
              />
            </View>
          </View>
          
        </View>
      </View>
    )
  }
}
