/*
 * @Author: yezunfa
 * @Date: 2020-08-02 19:35:44
 * @LastEditTime: 2020-08-02 21:22:56
 * @Description: 所有订单
 * todo: 上滑加载
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtActivityIndicator } from 'taro-ui'
import * as globalactions from '@actions/global'
import { GET_ALL_ORDER_MAIN  } from '@constants/api'
import fetch from '@utils/request'
import './index.scss'

import OrderMainItem from './order-main-item'

@connect(({global}) => ({...global}),{...globalactions})
export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dargStyle: {//下拉框的样式
                top: 0 + 'px'
            },
            downDragStyle: {//下拉图标的样式
                height: 0 + 'px'
            },
            downText: '下拉刷新',
            upDragStyle: {//上拉图标样式
                height: 0 + 'px'
            },
            pullText: '上拉加载更多',
            start_p: {},
            scrollY:true,
            dargState: 0,//刷新状态 0不做操作 1刷新 -1加载更多
            pagination: {
                pageSize: 10,
                current: 1,
                total:0
              },
            OrderMainList:[]
        }
    }

    async componentDidMount(){
       await this.InitialData()
    }

    InitialData = async newPage=> {
        const { pagination: _pagination } = this.state;
        const payload = { ..._pagination, ...newPage }
        const params = {
            url: GET_ALL_ORDER_MAIN,
            payload,
            // pureReturn: true,
        }
        const response = await fetch(params)
        const { current,total, pageSize, dataList } = response
        const pagination = {current,total, pageSize}
        this.setState({pagination, OrderMainList:dataList}) 
    }

    reduction() {//还原初始设置
        const time = 0.5;
        this.setState({
            upDragStyle: {//上拉图标样式
                height: 0 + 'px',
                transition: `all ${time}s`
            },
            dargState: 0,
            dargStyle: {
                top: 0 + 'px',
                transition: `all ${time}s`
            },
            downDragStyle: {
                height: 0 + 'px',
                transition: `all ${time}s`
            },
            scrollY:true
        })
        setTimeout(() => {
            this.setState({
                dargStyle: {
                    top: 0 + 'px',
                },
                upDragStyle: {//上拉图标样式
                    height: 0 + 'px'
                },
                pullText: '上拉加载更多',
                downText: '下拉刷新'
            })
        }, time * 1000);
    }
    touchStart(e) {
        this.setState({
            start_p: e.touches[0]
        })
    }
    touchmove(e) {
        let that = this
        let move_p = e.touches[0],//移动时的位置
            deviationX = 0.30,//左右偏移量(超过这个偏移量不执行下拉操作)
            deviationY = 70,//拉动长度（低于这个值的时候不执行）
            maxY = 100;//拉动的最大高度
 
        let start_x = this.state.start_p.clientX,
            start_y = this.state.start_p.clientY,
            move_x = move_p.clientX,
            move_y = move_p.clientY;
 
 
        //得到偏移数值
        let dev = Math.abs(move_x - start_x) / Math.abs(move_y - start_y);
        if (dev < deviationX) {//当偏移数值大于设置的偏移数值时则不执行操作
            let pY = Math.abs(move_y - start_y) / 3.5;//拖动倍率（使拖动的时候有粘滞的感觉--试了很多次 这个倍率刚好）
            if (move_y - start_y > 0) {//下拉操作
                if (pY >= deviationY) {
                    this.setState({ dargState: 1, downText: '释放刷新' })
                } else {
                    this.setState({ dargState: 0, downText: '下拉刷新' })
                }
                if (pY >= maxY) {
                    pY = maxY
                }
                this.setState({
                    dargStyle: {
                        top: pY + 'px',
                    },
                    downDragStyle: {
                        height: pY + 'px'
                    },
                    scrollY:false//拖动的时候禁用
                })
            }
            if (start_y - move_y > 0) {//上拉操作
                console.log('上拉操作')
                if (pY >= deviationY) {
                    this.setState({ dargState: -1, pullText: '释放加载更多' })
                } else {
                    this.setState({ dargState: 0, pullText: '上拉加载更多' })
                }
                if (pY >= maxY) {
                    pY = maxY
                }
                this.setState({
                    dargStyle: {
                        top: -pY + 'px',
                    },
                    upDragStyle: {
                        height: pY + 'px'
                    },
                    scrollY: false//拖动的时候禁用
                })
            }
 
        }
    }
    pull() {//上拉
        console.log('上拉')
        // this.props.onPull()
    }
    down() {//下拉
    console.log('下拉')
        // this.props.onDown()
    }
    ScrollToUpper() { //滚动到顶部事件
    console.log('滚动到顶部事件')
        // this.props.Upper()
    }
    ScrollToLower() { //滚动到底部事件
    console.log('滚动到底部事件')
        // this.props.Lower()
    }
    touchEnd(e) {
        if (this.state.dargState === 1) {
            this.down()
        } else if (this.state.dargState === -1) {
            this.pull()
        }
        this.reduction()
    }


  render () {
    const { userinfo } = this.props
    const { IsSysUser} = userinfo
    const { OrderMainList, dargStyle, downDragStyle, upDragStyle } = this.state
    console.log(OrderMainList)
    if (!IsSysUser) return <Text>您当前没有权限查看！</Text>
    return (
        <View className='dragUpdataPage'>
            <View className='downDragBox' style={downDragStyle}>
                <AtActivityIndicator></AtActivityIndicator>
                <Text className='downText'>{this.state.downText}</Text>
            </View>
            <ScrollView
                style={dargStyle}
                onTouchMove={this.touchmove}
                onTouchEnd={this.touchEnd}
                onTouchStart={this.touchStart}
                onScrollToUpper={this.ScrollToUpper}
                onScrollToLower={this.ScrollToLower}
                className='dragUpdata'
                scrollY={this.state.scrollY}
                scrollWithAnimation>
                <View style='width:100%;height:100%;' >
                    {OrderMainList && OrderMainList.map(item=>{
                        return <OrderMainItem key={JSON.stringify(item.Id)} data={item} />
                    })
                    }
                </View>
            </ScrollView>
            <View className='upDragBox' style={upDragStyle}>
                <AtActivityIndicator></AtActivityIndicator>
                <Text className='downText'>{this.state.pullText}</Text>
            </View>
        </View>
    )
  }
}

