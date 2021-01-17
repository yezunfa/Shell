import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { FormInput, FormIphone } from '@components'
import ConsultButtonFix from './ConsultButtonFix/index'

const baseClass = 'consult-page'

class Index extends PureComponent {

    render() {
        return (
            <View className={`${baseClass}`}>
                <View className={`${baseClass}-topImage`}>
                    首页图片列表，填充页面
                </View>
                <View className={`${baseClass}-form`}>
                    <FormInput required={true} title='姓名' placeholder='请输入' />
                    <FormIphone required={true} title='电话' placeholder='请输入' />
                </View>
                <View className={`${baseClass}-buttom`}>
                    底部图片列表
                </View>
                <View className={`${baseClass}-suspend`}>
                    <ConsultButtonFix />
                </View>
            </View>
        )
    }

}

export default Index