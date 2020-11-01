import Taro, { PureComponent } from '@tarojs/taro'
import { handleLongIntroduce } from '@utils/public'
import { ThemeButton, WriteOffButton } from '@components'
import { DefaultLog } from '@constants/api'
import { ClText, ClInput } from "mp-colorui"

import './index.scss'

class Index extends PureComponent {

    defaultProps = {
        model: 'normal',
    }

    state = {
        showModal: false,
    }
   
    productRefresh() {
        const { refresh } = this.props
        refresh && refresh()
    }

    render () {
        const { item={}, model='normal' } = this.props
        const {
            BannerList='[]',
            ProductName='-',
            Introduce='-',
            Price='-',
            Count='-'
        } = item
        const Banner = JSON.parse(BannerList)[0]
        return (
            <View>
                <View className='products-list__item flex-row-space-between'>
                    <View className='products-list__item_img'>
                        <Image className='image' src={Banner || DefaultLog} mode='aspectFit' />
                    </View>
                    <View className='products-list__item_container'>
                        <ClText text={ProductName} size='small' textColor='black' />
                        <ClText text={handleLongIntroduce(Introduce, 27)} size='xsmall' textColor='black' />
                    </View>
                    <View className='products-list__item_number'>
                        <ClText text={`￥${Price}`} size='normal' textColor='black' />
                        <ClText text={`x${Count}`} size='normal' textColor='grey' />
                    </View>
                </View>
                {model === 'writeOff' && <View className='products-list__botton'>
                    <WriteOffButton disable={Count <= 0 ? true : false} refresh={this.productRefresh} data={item} />
                </View>}
            </View>
        )
    }
}

export default Index