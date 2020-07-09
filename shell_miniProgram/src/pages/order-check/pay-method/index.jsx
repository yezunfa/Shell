import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { pay_method } from '@constants/enums'
import { ClText } from "mp-colorui";
import icons from '@assets'

import './index.scss'

const baseClass = 'payComponent'
class Index extends PureComponent {

    render() {
        return (
            <View className={`${baseClass}`}>
                <View className={`${baseClass}__title`}>
                    <ClText text='支付方式' size='normal' textColor='black' />
                </View>
                <View className={`${baseClass}__pay`}>
                    {pay_method && pay_method.map((item, index) => 
                        <View key={JSON.stringify(index)} className={`${baseClass}__pay-item`}>
                            <View className={`${baseClass}__pay-item-icon`}>
                                <Image className='icon' mode='aspectFit' src={icons.wechartPay} />
                                <View className={`${baseClass}__pay-item-icon-text`}>
                                    <ClText text={item.title} size='normal' textColor='black' />
                                </View>
                            </View>
                            <View className={`${baseClass}__pay-item-right`}>
                                <Image className='icon' src={icons.choose} />
                                {/* <Image className='icon' src={icons.dis_choose} /> */}
                            </View>
                        </View>    
                    )}
                </View>
            </View>
        )
    }

}

export default Index