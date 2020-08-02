import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import icons from '@assets'
import { ClText, ClAvatar } from "mp-colorui";

import './index.scss'


class Index extends PureComponent {

    render() {

        // const { store } = this.props
        const store = {
            Name: '贝壳口腔',
            Banner: [{ url: 'http://cdn.shuaixiaoxiao.com/image/20200706004653.jpg' }],
            Address: '江西赣州市章贡区赣康路与锦江路交汇处中央公园首府7栋17号商铺'
        }

        return (
            <View className='store'>
                <View className='store__banner'>
                    <ClAvatar headerArray={store.Banner} shape='round' size='small' />
                </View>
                <View className='store__info'>
                    <ClText text={store.Name} size='normal' />
                    <ClText text={store.Address} size='small' />
                    <ClText text='下单后请到以上地址接受服务' textColor='orange' size='small' />
                </View>
                <View className='store__more-tip'>
                    <Image className='icon' src={icons.more} />
                </View>
            </View>
        )
    }

}

export default Index