import Taro, { PureComponent } from '@tarojs/taro'
import { POST_ORDER_WRITEOFF } from '@constants/api'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import { ThemeButton, InputNumber } from '@components'
import fetch from '@utils/request'
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
        // POST_ORDER_WRITEOFF
        const { data, refresh } = this.props
        const { cnt } = this.state
        const payload = {}
        payload.OrderSubId = data.Id
        payload.cnt = cnt
        const params = {
            url: POST_ORDER_WRITEOFF,
            payload,
            pureReturn: true,
            method: 'POST'
        }
        try {
            const response = await fetch(params)
            if (!response) return Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
            if (!response.success) return Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
        } catch (error) {
            console.error(error)
            Taro.showToast({ title: '网络繁忙，请重试', icon: 'none' })
        }
        this.handleModalShow(false)
        Taro.showToast({ title: '核销成功', icon: 'success' })
        refresh && refresh()
    }

    handleUpdate = (cnt) => {
        this.setState({ cnt })
    }

    render () {
        const { disable } = this.props
        const { showModal, cnt } = this.state
        return (
            <View>
                <ThemeButton disable disableTopMsg='没有剩余的商品了哦~' onClick={() => { this.handleModalShow(true) }} text='核销' size='small' />
                {showModal && 
                    <AtModal 
                        onClose={() => { this.handleModalShow(false) }}
                        isOpened={showModal}>
                        <AtModalHeader>核销数量</AtModalHeader>
                        <AtModalContent>
                            <View className='item-spec__group'>
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