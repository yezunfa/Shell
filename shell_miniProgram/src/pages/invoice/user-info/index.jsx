import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { ClInput } from "mp-colorui";

import './index.scss'

class Index extends PureComponent {

    defaultProps = {
        orderData: {},
    }

    render() {
        const { orderData } = this.props
        if (!orderData) return null
        const { LinkMobile, LinkName, Remark } = orderData
        return (
            <View className='userinfo'>
                <View className='theme-title'>
                    <ClInput titleWidth={200} title="使用人" value={LinkName} disabled />
                </View>
                <View>
                    <ClInput type='number' titleWidth={200} title="联系电话" value={LinkMobile} disabled />
                </View>
                {Remark && <View>
                    <ClInput value={Remark} disabled/>
                </View>
                }
            </View>
        )
    }

}

export default Index