import Taro, { Component } from '@tarojs/taro'
import { View, Input, Button } from '@tarojs/components'
import './index.scss'

const baseClass = 'form-input-component'

class Index extends Component {

    static defaultProps = {
        required: false,
        title: '标题',
        disable: false,
        role: null,
        placeholder: '请输入...'
    }

    render() {

        const { required, title, disable, role, placeholder } = this.props

        return (
            <View className={`${baseClass}`}>
                <View className={`${baseClass}-title at-row`}>
                    {title}
                    {required && <View className={`${baseClass}-title-star`}>*</View>}
                </View>
                <View className={`${baseClass}-value at-row at-row__justify--center`}>
                    <Input className={`${baseClass}-value-input`} placeholder={placeholder} />
                    <Button className={`${baseClass}-value-button`}>自动获取</Button>
                </View>
                <View className={`${baseClass}-line`}/>
            </View>
        )
    }

}

export default Index