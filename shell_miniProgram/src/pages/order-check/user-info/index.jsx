import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { ClInput } from "mp-colorui";

import './index.scss'

class Index extends PureComponent {

    render() {
        return (
            <View className='userinfo'>
                <ClInput titleWidth={200} title="取货人" placeholder="请输入姓名" />
                <ClInput titleWidth={200} title="联系电话" placeholder="请输入手机号" />
            </View>
        )
    }

}

export default Index