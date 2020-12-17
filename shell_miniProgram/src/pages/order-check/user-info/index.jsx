import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { ClInput } from "mp-colorui";

import './index.scss'

class Index extends PureComponent {

    defaultProps = {
        submitData: {},
        setFormState: () => {},
        defaultValue:{}
    }

    componentDidMount = async () => {
        const { defaultValue: userinfo } = this.props
        if (userinfo) {
            await this.setFormState(userinfo.Name, 'UserName')
            await this.setFormState(userinfo.Mobile, 'UserName')
            
        }
    }
    setFormState = async (e, key) => {
        const { setFormState } = this.props
        setFormState && setFormState({ key, value: e })
    }

    render() {
        const { defaultValue: userinfo } = this.props
        
        return (
            <View className='userinfo'>
                <View className='theme-title'>
                    <ClInput onBlur={(value) => { this.setFormState(value, 'UserName') }} 
                        titleWidth={200} title="使用人" 
                        placeholder="请输入姓名" 
                        defaultValue={userinfo ? userinfo.Name : ''}
                        />
                </View>
                <View>
                    <ClInput type='number' 
                        onBlur={(value) => { this.setFormState(value, 'UserMobile') }} titleWidth={200} 
                        title="联系电话" 
                        placeholder="请输入手机号" 
                        defaultValue={userinfo ? userinfo.Mobile : ''}
                        />
                </View>
                <View>
                    <ClInput onBlur={(value) => { this.setFormState(value, 'Message') }} placeholder="给商家留言……" />
                </View>
            </View>
        )
    }

}

export default Index