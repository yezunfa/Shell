import Taro, { PureComponent } from '@tarojs/taro'
import { Avatar } from '@components/'
import { View, Image, ScrollView } from '@tarojs/components'
import { API_GET_PRODUCT_QRCODE } from '@constants/api'
import fetch from '@utils/request'
import { uuid_compression } from '@utils/methods'
import { getWindowWidth, getWindowHeight } from '@utils/style'
import IconTure from './assets/paysuccess.png'
import './index.scss'

const baseClass = 'newQrcode-component'
export default class Index extends PureComponent {
    constructor (props) {
        super(props)
        this.state = {
          imageTempPath:''
        }
      }
      componentWillMount() {
        this.drawBall()
      }
      


      async getQrcode(){
        const { qrcode } = this.props
        var timestamp = new Date().getTime();
        const fsm = wx.getFileSystemManager();
        const FILE_BASE_NAME = 'tmp_img_src' + timestamp;
        let filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.jpg`;
        // console.log(qrcode)
        fsm.writeFile({
               filePath,
               data: qrcode,
               encoding: 'base64',
               success(res) {
                   wx.getImageInfo({
                     src:filePath,
                     success(path) {
                         console.log(path)
                        // ctx.drawImage(path.path, (_this.phoneW - 80) / 2, 380 * scaleH, 80, 80)
                        // ctx.draw(true)
                     },
                     fail(err) {
                         console.log(filePath)
                         console.log('保存本地文件失败')
                        console.log(err);
                     }
                  })
               },
               fail() {
                //   this.canvasFlag = true;
                  Taro.showToast({
                     title: '小程序码生成失败',
                     duration: 2000,
                     icon: 'none'
                  });
               },
            });

        await this.asyncSetState({ filePath }) 
      }

      asyncSetState = async state => new Promise(resolve => { this.setState(state, (res => { res({ message: '更新完成', state }) }).bind(this, resolve)) })

      async drawBall() {

        // this.getQrcode()

        const { data:ProdectInfo } = this.props
        // const { filePath, qrcode } = this.state
        const { simpleDesc, BannerList, Name, Price } = ProdectInfo
        // const context = Taro.createCanvasContext('shareCanvas',this)
        // const imgPath1 = BannerList ? JSON.parse(BannerList)[0]: 'https://assets.51fusion.com/39aed86d-0a40-4335-935e-25939d2a6c6a.png';
        // const imgPath2 = 'https://assets.51fusion.com/15c310cd-03f3-4f62-a372-632e6c1fed86.png'// filePath; // 小程序图片临时路径
        // const _this = this;

        // Taro.getImageInfo({
        //   src: imgPath1,
        // }).then((res)=>{
        //     context.drawImage(res.path, 0, 0, 375, 190);
        //       Taro.getImageInfo({
        //         src: imgPath2,
        //       }).then((res2)=>{
        //         context.drawImage(res2.path, 250, 195, 86, 86);
        //         const h = _this.fillTextWrap(context, `[${Name}] ${simpleDesc}`, 20, 230, 190, 20);
        //         context.font = 'normal 11px ArialMT sans-serif';
        //         context.setFontSize(16);
        //         context.setFillStyle('#FF6066');
        //         context.fillText(`¥${Price}`, 20, 310);
        //         context.font = 'normal 11px  PingFangSC-Regular sans-serif';
        //         context.setFontSize(12);
        //         context.setFillStyle('#FA2E9A');
        //         context.fillText('扫描小程序码查看', 245, 300);
        //         context.draw(false);
        //         context.draw(false, ()=> {
        //             Taro.canvasToTempFilePath({
        //               canvasId: 'canvas',
        //               success: function(res) {
        //                 // 获得图片临时路径
        //                 _this.setState({
        //                   imageTempPath:res.tempFilePath
        //                 })
        //               }
        //             })
        //           });
      
        //       });
        // });

        var ctx = Taro.createCanvasContext('shareCanvas',this.$scope)
        const imgPath1 = BannerList ? JSON.parse(BannerList)[0]: 'https://assets.51fusion.com/39aed86d-0a40-4335-935e-25939d2a6c6a.png';
        // const imgPath1 = 'https://assets.51fusion.com/39aed86d-0a40-4335-935e-25939d2a6c6a.png';
        const imgPath2 = 'https://assets.51fusion.com/15c310cd-03f3-4f62-a372-632e6c1fed86.png'// filePath; // 小程序图片临时路径
        const imgTempPath1 = await Taro.downloadFile({ url: imgPath1 });
        const imgTempPath2 = await Taro.downloadFile({ url: imgPath2 });
        ctx.drawImage(imgTempPath1.tempFilePath, 0, 0, 375, 190);
        ctx.drawImage(imgTempPath2.tempFilePath, 250, 195, 86, 86);
        this.fillTextWrap(ctx, `[${Name}] ${simpleDesc}`, 20, 230, 190, 20);
        ctx.font = 'normal 11px ArialMT sans-serif';
        ctx.setFontSize(16);
        ctx.setFillStyle('#FF6066');
        ctx.fillText(`¥${Price}`, 20, 310);
        ctx.font = 'normal 11px  PingFangSC-Regular sans-serif';
        ctx.setFontSize(12);
        ctx.setFillStyle('#FA2E9A');
        ctx.fillText('扫描小程序码查看', 245, 300);
        ctx.draw(false);

      }

      async wxDrawImage(callback){
        const { data:ProdectInfo } = this.props
        const { simpleDesc, BannerList, Name, Price } = ProdectInfo

        var ctx = Taro.createCanvasContext('shareCanvas',this.$scope)
        const imgPath1 = BannerList ? JSON.parse(BannerList)[0]: 'https://assets.51fusion.com/39aed86d-0a40-4335-935e-25939d2a6c6a.png';
        const imgPath2 = 'https://assets.51fusion.com/15c310cd-03f3-4f62-a372-632e6c1fed86.png'// filePath; // 小程序图片临时路径
        const imgTempPath1 = await Taro.downloadFile({ url: imgPath1 });
        const imgTempPath2 = await Taro.downloadFile({ url: imgPath2 });
        ctx.drawImage(imgTempPath1.tempFilePath, 0, 0, 375, 190);
        ctx.drawImage(imgTempPath2.tempFilePath, 250, 195, 86, 86);
        this.fillTextWrap(ctx, `[${Name}] ${simpleDesc}`, 20, 230, 190, 20);
        ctx.font = 'normal 11px ArialMT sans-serif';
        ctx.setFontSize(16);
        ctx.setFillStyle('#FF6066');
        ctx.fillText(`¥${Price}`, 20, 310);
        ctx.font = 'normal 11px  PingFangSC-Regular sans-serif';
        ctx.setFontSize(12);
        ctx.setFillStyle('#FA2E9A');
        ctx.fillText('扫描小程序码查看', 245, 300);
        // ctx.draw(false);
        ctx.draw(false,()=>{
            callback && callback()
        })
    
      }

      // 获取微信相册授权信息
      getSetting(){
        return new Promise((resolve,reject)=>{
          Taro.getSetting()
          .then((res)=>{
            if (!res.authSetting['scope.writePhotosAlbum']) {
              Taro.authorize({
                scope:'scope.writePhotosAlbum',
              })
              .then(res=>{
                if(res.errMsg == 'authorize:ok'){
                  resolve(true)
                }else{
                  reject(false)
                }
              })
              .catch(()=>{
                reject(false)
              })
            }else{
              resolve(true)
            }
          })
          .catch(()=>{
            reject(false)
          })
        })
      }

      openShareImg(){
        this.getSetting().then((res)=>{
          if(!res){
            this.showModal()
          }else{
            this.wxDrawImage(()=>{
              this.saveImage()
            })
          }
        }).catch(()=>{
          this.showModal()
        })
      }

      // 授权提示
  showModal(){
    let that = this;
    Taro.showModal({
      title: '授权提示',
      content: '打开保存图片权限',
      success (res) {
        if (res.confirm) {
        Taro.openSetting({
          success (res) {
            if(res.authSetting['scope.writePhotosAlbum']){
              // 调用画图
              console.log('授权成功');
              that.wxDrawImage(()=>{
                that.saveImage()
              })
            }else{
              Taro.showToast({
                title: '授权失败',
                icon: 'none'
              });
            }
          },
          fail(){
            Taro.showToast({
              title: '授权失败',
              icon: 'none'
            });
          }
        })
        } else if (res.cancel) {
          Taro.showToast({
            title: '授权失败',
            icon: 'none'
          });
        }
      }
    })
  }
     
  downLoad(){
    let that = this;
    that.openShareImg();
  }

  // 图片保存
  saveImage(){
    let that = this;
    const {canvasWidth, canvasHeight} = this.state
    Taro.canvasToTempFilePath({
      width: canvasWidth,
      height: canvasHeight,
      destWidth: canvasWidth * 2,
      destHeight: canvasHeight * 2,
      x: 0,
      y: 0,
      canvasId: 'shareCanvas',
      success: function(res) {
        console.log('canvas转temp path成功:', res);
        Taro.hideLoading();
        Taro.showToast({ title: '海报生成成功' });
        Taro.saveImageToPhotosAlbum({
            filePath: res.tempFilePath
        }).then(res=>{
            console.log('保存图片至本地：', res)
        })
        // that.setState({
        //   posterImage: res.tempFilePath
        // })
      },
      fail: function(fail) {
        console.log('canvas转temp path失败:', fail);
        Taro.showToast({ title: `海报生成失败：${fail}` });
        Taro.hideLoading();
      }
    },that.$scope)
  }
    
       // 文字换行
    fillTextWrap(ctx, text, x, y, maxWidth, lineHeight) {
        // 设定默认最大宽度
        const systemInfo = Taro.getSystemInfoSync();
        const deciveWidth = systemInfo.screenWidth;
        // 默认参数
        maxWidth = maxWidth || deciveWidth;
        lineHeight = lineHeight || 20;
        // 校验参数
        if (typeof text !== 'string' || typeof x !== 'number' || typeof y !== 'number') {
        return;
        }
        // 字符串分割为数组
        const arrText = text.split('');
        // 当前字符串及宽度
        let currentText = '';
        let currentWidth;
        ctx.font = 'normal 11px sans-serif';
        ctx.setFontSize(12);
        ctx.setFillStyle('#3A3A3A');
        ctx.setTextAlign('justify');
        for (let letter of arrText) {
        currentText += letter;
        currentWidth = ctx.measureText(currentText).width;
        if (currentWidth > maxWidth) {
            ctx.fillText(currentText, x, y);
            currentText = '';
            y += lineHeight;
        }
        }
        if (currentText) {
        ctx.fillText(currentText, x, y);
        }
        }

    // // 点击保存图片生成微信临时模板文件path
    // save() {
    //     const that = this
    //     setTimeout(() => {
    //     Taro.canvasToTempFilePath({ // 调用小程序API对canvas转换成图
    //         x: 0, // 开始截取的X轴
    //         y: 0, // 开始截取的Y轴
    //         width: 355, // 开始截取宽度
    //         height: 635,  // 开始截取高度
    //         destWidth: 1065,  // 截取后图片的宽度（避免图片过于模糊，建议2倍于截取宽度）
    //         destHeight: 1905, // 截取后图片的高度（避免图片过于模糊，建议2倍于截取宽度）
    //         canvasId: 'canvas', // 截取的canvas对象
    //         success: function (res) { // 转换成功生成临时链接并调用保存方法
    //         that.saveImage(res.tempFilePath)
    //         },
    //         fail: function (res) {
    //         console.log('绘制临时路径失败')
    //         }
    //     })
    //     }, 100) // 延时100做为点击缓冲，可以不用
    // }

    // // 保存图片
    // saveImage(imgSrc) {
    //     Taro.getSetting({
    //       success() {
    //         Taro.authorize({
    //           scope: 'scope.writePhotosAlbum', // 保存图片固定写法
    //           success() {
    //             // 图片保存到本地
    //             Taro.saveImageToPhotosAlbum({
    //               filePath: imgSrc, // 放入canvas生成的临时链接
    //               success() {
    //                 Taro.showToast({
    //                   title: '保存成功',
    //                   icon: 'success',
    //                   duration: 2000
    //                 })
    //               }
    //             })
    //           },
    //           fail() {
    //             Taro.showToast({
    //               title: '您点击了拒绝微信保存图片，再次保存图片需要您进行截屏哦',
    //               icon: 'none',
    //               duration: 3000
    //             })
    //           }
    //         })
    //       }
    //     })
    //   }

    
    render() {
        const { list=[], title, onClose, qrcode } = this.props;
        // const { qrcode } = this.state
        const screenHeight = parseInt(getWindowHeight())
        const screenWidth = parseInt(getWindowWidth())
        return (
            <View 
                style={{ 
                    height: `${screenHeight*0.85}px`, 
                    width: `${screenWidth*0.9}px` 
                }} 
                className={`${baseClass}`}
            >
                <canvas style="width: 375px; height: 320px;background:#fff" canvas-id="shareCanvas"></canvas>
                <View className={`${baseClass}-qrcode`}>
                    <Image src={qrcode} mode='aspectFit' />
                </View>

                <View className={`${baseClass}-buttonView`}>
                    <View className='okBtn modalBtn' onClick={this.downLoad.bind(this)}>
                        保存图片
                    </View>
                    <View className='cancelBtn modalBtn' onClick={() => { onClose && onClose() }}>
                        取消
                    </View>
                </View>
            </View>
        )
    }

}