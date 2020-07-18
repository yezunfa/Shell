import Taro, { Component } from '@tarojs/taro'
import { View, Label } from '@tarojs/components'
import { ClTabs } from "mp-colorui";

import VerbTabs from './assets/verb-tabs'
import './index.scss'

const verbTabs = [ 
    { text: "全部", id: "verb__all" }, 
    { text: "待付款", id: "verb__non-pay" }, 
    { text: "待使用", id: "verb__be-use" }, 
    { text: "已失效", id: "verb__expired" }, 
    { text: "待评价", id: "verb__evaluate" } 
];

const baseClass = 'page'
class Index extends Component {

    state = {
        loadding: true,
        activeKey: 'verb__all',
    }

    componentDidMount = () => {}

    asyncSetState = async state => new Promise(resolve => { this.setState(state, (res => { res({ message: '更新完成', state }) }).bind(this, resolve)) })

    handleTabsClick = async e => {
        await this.asyncSetState({ activeKey: verbTabs[e].id })
    }

    render () {
        const { activeKey } = this.state
        return (
            <View className={`${baseClass}`}>
                <ClTabs onClick={this.handleTabsClick} tabs={verbTabs} type="verb" activeColor='red'> 
                    {verbTabs.map(item => (
                        <Label key={item.id} id={item.id} />
                    ))} 
                </ClTabs>
                {activeKey === 'verb__all' && <VerbTabs Id='verb__all' />}
                {activeKey === 'verb__non-pay' && <VerbTabs Id='verb__non-pay' />}
            </View>
        )
    }

}

export default Index