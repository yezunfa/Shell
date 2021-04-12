/*
 * @Author: yezunfa
 * @Date: 2020-12-02 00:39:12
 * @LastEditTime: 2021-04-08 21:27:18
 * @Description: Do not edit
 */
import Taro from '@tarojs/taro'

const NAVIGATOR_HEIGHT = 44
const TAB_BAR_HEIGHT = 50

/**
 * 返回屏幕可用高度
 * // NOTE 各端返回的 windowHeight 不一定是最终可用高度（例如可能没减去 statusBar 的高度），需二次计算
 * @param {*} showTabBar
 */
export function getWindowHeight(showTabBar = true) {
  const info = Taro.getSystemInfoSync()
  const { windowHeight, statusBarHeight, titleBarHeight } = info
  const tabBarHeight = showTabBar ? TAB_BAR_HEIGHT : 0

  if (process.env.TARO_ENV === 'rn') {
    return windowHeight - statusBarHeight - NAVIGATOR_HEIGHT - tabBarHeight
  }

  if (process.env.TARO_ENV === 'h5') {
    return `${windowHeight - tabBarHeight}px`
  }

  if (process.env.TARO_ENV === 'alipay') {
    // NOTE 支付宝比较迷，windowHeight 似乎是去掉了 tabBar 高度，但无 tab 页跟 tab 页返回高度是一样的
    return `${windowHeight - statusBarHeight - titleBarHeight + (showTabBar ? 0 : TAB_BAR_HEIGHT)}px`
  }

  return `${windowHeight}px`
}

/**
 * // NOTE 样式在编译时会通过 postcss 进行处理，但 js 中的 style 可能需要运行时处理
 * 例如加 prefix，或者对 RN 样式的兼容，又或是在此处统一处理 Taro.pxTransform
 * 此处只做演示，若需要做完善点，可以考虑借助 https://github.com/postcss/postcss-js
 */
export function postcss(style) {
  if (!style) {
    return style
  }
  const { background, ...restStyle } = style
  const newStyle = {}
  if (background) {
    // NOTE 如 RN 不支持 background，只支持 backgroundColor
    newStyle.backgroundColor = background
  }
  return { ...restStyle, ...newStyle }
}
 /**
 * 返回屏幕可用宽度
 */
export function getWindowWidth() {
  const info = Taro.getSystemInfoSync()
  const { windowWidth } = info
  return `${windowWidth}px`
}
/**
* 端口尺寸转换规则(单位换算)
* @param {*} num rpx
*/
export function getEmbeddedStyle(num) {
  // if (process.env.TARO_ENV === 'rn') {
  //     //return `${2 * num}px`
  //     return `${parseFloat(windowWidth) * num / 750}px`
  // }
  // if (process.env.TARO_ENV === 'h5') {
      
  // }
  // if (process.env.TARO_ENV === 'weapp') {
  //     return `${num}rpx`
  // }
  return Taro.pxTransform(num)
}
