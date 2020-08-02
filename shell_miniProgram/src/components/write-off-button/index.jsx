import Taro, { PureComponent } from '@tarojs/taro'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import { ThemeButton, InputNumber } from '@components'
import { View } from '@tarojs/components'

export default class Index extends PureComponent {

    state = {
        showModal: false,
        cnt: 0,
    }

    asyncSetState = async state => new Promise(resolve => { this.setState(state, (res => { res({ message: '更新完成', state }) }).bind(this, resolve)) })

    handleModalShow = async (bool) => {
        await this.asyncSetState({ showModal: bool })
    }

    handleConfirm = async () => {
        // 审核一张或多张商品
        // 需要判断是否全部用完，若是，则order_main也需要修改使用完毕的状态
    }

    handleUpdate = (cnt) => {
        this.setState({ cnt })
    }

    render () {
        const { showModal, cnt } = this.state
        return (
            <View>
                <ThemeButton onClick={() => { this.handleModalShow(true) }} text='核销' size='small' />
                {showModal && 
                    <AtModal 
                        onClose={() => { this.handleModalShow(false) }}
                        isOpened={showModal}>
                        <AtModalHeader>核销提示</AtModalHeader>
                        <AtModalContent>
                            <View className='item-spec__group'>
                                <Text className='item-spec__group-title'>数量</Text>
                                <InputNumber
                                    num={cnt}
                                    onChange={this.handleUpdate}
                                    compStyle={{
                                    marginTop: Taro.pxTransform(20),
                                    height: Taro.pxTransform(68)
                                    }}
                                    numStyle={{
                                    width: Taro.pxTransform(130)
                                    }}
                                />
                            </View>
                        </AtModalContent>
                        <AtModalAction> 
                            <Button onClick={() => { this.handleModalShow(false) }}>取消</Button> 
                            <Button onClick={this.handleConfirm}>确定</Button> 
                        </AtModalAction>
                    </AtModal>
                }
            </View>
        )
    }
}