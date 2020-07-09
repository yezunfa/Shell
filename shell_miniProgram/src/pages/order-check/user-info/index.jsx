import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { ClInput } from "mp-colorui";

import './index.scss'

class Index extends PureComponent {

    render() {
        return (
            <View className='userinfo'>
                <View className='theme-title'>
                    <ClInput titleWidth={200} title="取货人" placeholder="请输入姓名" />
                </View>
                <View>
                    <ClInput titleWidth={200} title="联系电话" placeholder="请输入手机号" />
                </View>
            </View>
        )
    }

}

export default Index