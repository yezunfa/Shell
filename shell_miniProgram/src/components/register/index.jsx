import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Button, Image, Input } from '@tarojs/components'
import { Mongolia, ThemeButton0 } from '@components/'
import fetch from '@utils/request'
import * as actions from '@actions/global'
import { POST_WECHAT_CRYP_DATA, POST_USER_REGISTER } from '@constants/api'
import { getUserInfo } from '@utils/wechat';
import IconClose from './assets/close.svg';
import IconEnter from './assets/enter-red.svg'

import './index.scss'

const errmsg = "网络异常, 请刷新重试"
@connect(state => ({...state.global, ...actions}))
export default class PageIndex extends Component {

    config = {
        navigationBarTitleText: '注册'
    }

    form = [
        { label: '姓名', required: true, key: 'Name' },
        { label: '电话', required: true, key: 'Mobile' },
        { label: '身份证', key: 'CertificateCode', placeholder: '选填' },
    ]

    state = {
        formdata: {},
        visible: false,
        loading: false,
        CertificateType: 4
    }

    initForm = async () => {
        const { form } = this
        const { userinfo } = this.props

        const formdata = {}
        for (const iterator of form) {
            const { key } = iterator
            formdata[key] = userinfo[key]
        }
        await this.asyncSetState({formdata})
    }

    asyncSetState = state => new Promise(resolve => { this.setState(state, (res => res({ state })).bind(this, resolve))})
    
    onRegister = async ({detail}) => {
        const errmsg = '授权失败'
        try {
            const { errMsg } = detail
            this.detail = detail.userInfo
            if (errMsg !== "getUserInfo:ok") throw new Error(errMsg)
            await this.initForm()
            await this.asyncSetState({visible: true})
        } catch (error) {
            const icon = "none"
            const title = error.message || errmsg
            console.error(error)
            Taro.showToast({ title, icon })
        }
    }

    /**
     * 用户同意获取手机号码
     * 解密code并保存
     */
    getPhoneNumber = async ({ detail }) => {
        const errmsg = '网络异常'
        const { formdata: _data } = this.state
        try {
            const formdata = {..._data}
            if (!detail) throw new Error(errmsg)
            const { errMsg, encryptedData, iv } = detail
            
            if (errMsg === 'getPhoneNumber:fail user deny') throw new Error('用户已拒绝')
            if (errMsg !== 'getPhoneNumber:ok') throw new Error(errMsg)
            const { signature, rawData, code: js_code } = await getUserInfo()
        
            const params = { method: "POST" }
            params.pureReturn = true 
            params.url = POST_WECHAT_CRYP_DATA
            params.payload = { encryptedData, iv, rawData, signature, js_code, saveMobile: true }

            const response = await fetch(params); // 解密手机号 同时将手机号保存到数据库
            console.log(response)
            if (!response) throw new Error(errmsg);
            if (!response.success || !response.data) throw new Error('微信后台出小差了，请重试～');
            const { purePhoneNumber } = response.data
            if (!purePhoneNumber) throw new Error(response.message || errmsg);

            formdata.Mobile = purePhoneNumber
            await this.asyncSetState({formdata})
        } catch (error) {
            const icon = "none"
            const title = error.message || errmsg
            console.error(error)
            Taro.showToast({ title, icon })
            return 
        }
    }

    onInputChange = (event, keyname) => {
        const { formdata: _data } = this.state
        const formdata = { ..._data }
        formdata[keyname] = event.detail.value
        this.asyncSetState({formdata})
    }

    regularCode = (value) => {
        const regularMap = {
            0: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x|X)$/, // 驾照正则
            2: /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/, // 港澳通行证 样本： H1234567890
            3: /^[a-zA-Z0-9]{5,17}$/, // 护照正则 样本： 141234567, G12345678, P1234567
            4: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, // 二代身份证正则
            // 1: /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/, // 军官证 待定 样本： 军字第2001988号, 士字第P011816X号
            // 3: /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/, // 维基百科的护照正则
        }
        // if (!regularMap[type]) return true
        if(regularMap[2].test(value)) return true
        return regularMap[4].test(value)
    }

    onConfirm = async () => {
        const { userinfo, dispatch , type = 'default'} = this.props
        const { formdata, CertificateType } = this.state
        const { avatarUrl, city, country, nickName, province, gender } = this.detail

        const payload = { 
            City: city,
            CertificateType,
            Country: country,
            Sex: gender || 0,
            Province: province,
            Avatar: avatarUrl,
            // Name: nickName,
            NickName: nickName,
            WechatName: nickName,
            openid: userinfo.openid, 
            unionid: userinfo.unionid
        }

        console.log(payload)
        const url = POST_USER_REGISTER // 保存用户信息
        
        try {
            for (const key in formdata) {
                const value = formdata[key]
                const config = this.form.find(item => item.key === key)

                if (!config) throw new Error(errmsg)
                const { label, required } = config
        
                if (!value && !required) continue
                if (!value || !`${value}`.length) throw new Error(`请补全用户${label}`)
                if (key === "CertificateCode" && !this.regularCode(value)) throw new Error(`非法的证件号码`)
                payload[key] = value
            }
            const result = await fetch({ url, method: "POST", pureReturn: true, payload });
            if (!result) throw new Error(errmsg)
            if(!result.success) throw new Error(result.message)

            await dispatch({ type: "userInfo", payload: result.data })
            Taro.showToast({ title: result.message, icon: 'success' })
            await this.onClose()
        } catch (error) {
            const title = error.message || errmsg
            Taro.showToast({ title, icon: 'none' })
            return
        }
    }

    onClose = async () => await this.asyncSetState({visible: false})
    
    render() {
        const { form } = this
        const { type = 'default' } = this.props
        const { visible, formdata } = this.state;
        const buttonclass = type === 'default' ? 'register-button' : 'register-jcombobox'
        return (
            <View className='register'>
                <Button lang='zh_CN' openType='getUserInfo' className={buttonclass} onGetUserInfo={this.onRegister}>
                    {type === 'default' ? '点击注册' : '修改个人信息'}
                    {type === 'update' && <Image src={IconEnter} className='register-jcombobox-icon'/>}
                </Button>
                <Mongolia show={visible}>
                <View className='register-dialog'>
                <View className='register-dialog-header'>
                <View>个人信息</View>
                <Image className='register-dialog-close' src={IconClose} onClick={this.onClose}/>
                </View>
                <View className='register-dialog-content'>
                {form.map((item) => {
                    const { key, label, placeholder } = item
                    const value = formdata[key] || ''
                    const classname = 'register-formitem'
                    const click = key === "Mobile" ? this.getPhoneNumber : null
                    return (
                        <Button 
                            openType={key === "Mobile" ? 'getPhoneNumber': 'default'} 
                            onGetPhoneNumber={click}
                            className={classname} 
                            key={key} 
                        >
                            <View className="label ellipsis">{ label }：</View>
                            {key !== "Mobile" && <Input placeholder={placeholder} className="input" value={value} onInput={event => this.onInputChange(event, key)}/>}
                            {key === "Mobile" && <View style={{color: "#999"}} className="input">{value || '请您点击授权'}</View>}
                        </Button>
                    )
                })}
                </View>
                <View className='register-dialog-footer'>
                    <ThemeButton0 onClick={this.onConfirm}>确认</ThemeButton0>
                    <View style={{width: '12px'}}/>
                    <ThemeButton0 type='default' onClick={this.onClose}>取消</ThemeButton0>
                </View>    
                </View>
                </Mongolia>
            </View>
        )
    }
}