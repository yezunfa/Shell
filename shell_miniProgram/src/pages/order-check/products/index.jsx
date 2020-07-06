import Taro, { PureComponent } from '@tarojs/taro'
import { View, Textarea, Image } from '@tarojs/components'
import { DefaultLog } from '@constants/api'
import { ClText, ClInput } from "mp-colorui";

import './index.scss'

class Index extends PureComponent {

    

    render() {
        // const { productList: _productList } = this.props
        const _productList = [
            { Name: '产品1', Introduce: '巴拉巴拉巴拉巴拉', Price: 30, Amount: 1, Banner: 'http://cdn.shuaixiaoxiao.com/image/20200705165405.jpg' },
            { Name: '产品2', Introduce: '巴拉巴拉巴拉巴拉', Price: 30, Amount: 1, Banner: 'http://cdn.shuaixiaoxiao.com/image/20200705165405.jpg' },
            { Name: '产品3', Introduce: '巴拉巴拉巴拉巴拉', Price: 30, Amount: 1, Banner: 'http://cdn.shuaixiaoxiao.com/image/20200705165405.jpg' },
            { Name: '产品4', Introduce: '巴拉巴拉巴拉巴拉', Price: 30, Amount: 1, Banner: 'http://cdn.shuaixiaoxiao.com/image/20200705165405.jpg' },
        ]

        return (
            <View className='products'>
                <View className='products-list'>
                    {_productList && _productList.map((item, index) => {
                        return <View key={JSON.stringify(index)} className='products-list__item flex-row-space-between'>
                            <View className='products-list__item_img'>
                                <Image className='image' src={item.Banner || DefaultLog} mode='aspectFit' />
                            </View>
                            <View className='products-list__item_container'>
                                <ClText text={item.Name} size='normal' textColor='black' />
                                <ClText text={item.Introduce} size='xsmall' textColor='black' />
                            </View>
                            <View className='products-list__item_number'>
                                <ClText text={`￥${item.Price}`} size='normal' textColor='black' />
                                <ClText text={`x${item.Amount}`} size='normal' textColor='grey' />
                            </View>
                        </View>
                    })}
                </View>
                <View className='products-textarea'>
                    <ClInput placeholder="给商家留言……" />
                </View>
            </View>
        )
    }

}

export default Index