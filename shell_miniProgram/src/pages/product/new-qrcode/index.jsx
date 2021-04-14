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
          filePath: '',
          // qrCodeTempPath:{}
        }
      }

    async componentDidMount() {
      // await this.getQrcode()
    }

    async componentWillReceiveProps() {
      await this.getQrcode()
    }

      async getQrcode(){
        const { qrcode: _qrcode } = this.props
        var qrcode = _qrcode.replace(/^data:image\/\w+;base64,/, "");
        const timestamp = new Date().getTime();
        const fsm = wx.getFileSystemManager();
        const FILE_BASE_NAME = timestamp;
        let filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.png`;
        let that = this;
        fsm.writeFileSync(filePath, qrcode, 'base64');
        that.drawBall(filePath);
      }

      asyncSetState = async state => new Promise(resolve => { this.setState(state, (res => { res({ message: '更新完成', state }) }).bind(this, resolve)) })

      async drawBall(qrCodeTempPath) {

        // this.getQrcode()

        const { data:ProdectInfo } = this.props
        // const { qrCodeTempPath } = this.state
        const { simpleDesc, BannerList, Name, Price } = ProdectInfo
        
        var ctx = Taro.createCanvasContext('shareCanvas',this.$scope)
        const imgPath1 = BannerList ? JSON.parse(BannerList)[0]: 'https://assets.51fusion.com/39aed86d-0a40-4335-935e-25939d2a6c6a.png';
        const bgImgPath = 'https://assets.51fusion.com/efe5af92-35e9-45ed-bcf5-22bedf4c174b.png'
        const logImgPath = 'https://assets.51fusion.com/2d089d8c-35d2-4cf2-ba7e-11a533865029.png'
        const imgTempPath1 = await Taro.downloadFile({ url: imgPath1 });
        const backgroundImg = await Taro.downloadFile({ url: bgImgPath });
        const logoImg = await Taro.downloadFile({ url: logImgPath });
        const imgTempPath2 = qrCodeTempPath;


        ctx.drawImage(backgroundImg.tempFilePath, 0, 0, 375, 400);
        this.fillTextWrap(ctx, `${Name}  贝壳口腔`, 20, 30, 190, 20);
        ctx.drawImage(logoImg.tempFilePath, 320, 0, 50, 50);
        ctx.drawImage(imgTempPath1.tempFilePath, 0, 50, 375, 190);
        ctx.drawImage(imgTempPath2, 250, 265, 86, 86);
        this.fillTextWrap(ctx, `${simpleDesc}`, 20, 265, 190, 20);
        ctx.font = 'normal 11px ArialMT sans-serif';
        ctx.setFontSize(16);
        ctx.setFillStyle('#FF6066');
        ctx.fillText(`¥${Price}`, 20, 270);
        ctx.font = 'normal 11px  PingFangSC-Regular sans-serif';
        ctx.setFontSize(12);
        ctx.setFillStyle('#FA2E9A');
        ctx.fillText('扫描小程序码查看', 245, 370);
        ctx.draw(false);

      }

      async wxDrawImage(callback){
        const { data:ProdectInfo } = this.props
        const { simpleDesc, BannerList, Name, Price } = ProdectInfo

        var ctx = Taro.createCanvasContext('shareCanvas',this.$scope)
        const imgPath1 = BannerList ? JSON.parse(BannerList)[0]: 'https://assets.51fusion.com/39aed86d-0a40-4335-935e-25939d2a6c6a.png';
        const bgImgPath = 'https://assets.51fusion.com/efe5af92-35e9-45ed-bcf5-22bedf4c174b.png'
        const logImgPath = 'https://assets.51fusion.com/2d089d8c-35d2-4cf2-ba7e-11a533865029.png'
        const imgTempPath1 = await Taro.downloadFile({ url: imgPath1 });
        const backgroundImg = await Taro.downloadFile({ url: bgImgPath });
        const logoImg = await Taro.downloadFile({ url: logImgPath });
        const imgTempPath2 = qrCodeTempPath;


        ctx.drawImage(backgroundImg.tempFilePath, 0, 0, 375, 400);
        this.fillTextWrap(ctx, `${Name}  贝壳口腔`, 20, 30, 190, 20);
        ctx.drawImage(logoImg.tempFilePath, 320, 0, 50, 50);
        ctx.drawImage(imgTempPath1.tempFilePath, 0, 50, 375, 190);
        ctx.drawImage(imgTempPath2, 250, 265, 86, 86);
        this.fillTextWrap(ctx, `${simpleDesc}`, 20, 265, 190, 20);
        ctx.font = 'normal 11px ArialMT sans-serif';
        ctx.setFontSize(16);
        ctx.setFillStyle('#FF6066');
        ctx.fillText(`¥${Price}`, 20, 270);
        ctx.font = 'normal 11px  PingFangSC-Regular sans-serif';
        ctx.setFontSize(12);
        ctx.setFillStyle('#FA2E9A');
        ctx.fillText('扫描小程序码查看', 245, 370);
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
        Taro.hideLoading();
        Taro.showToast({ title: '海报生成成功' });
        Taro.saveImageToPhotosAlbum({
            filePath: res.tempFilePath
        }).then(res=>{
            // console.log('保存图片至本地：', res)
        })
        // that.setState({
        //   posterImage: res.tempFilePath
        // })
      },
      fail: function(fail) {
        // console.log('canvas转temp path失败:', fail);
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

    
    render() {
        const { list=[], title, onClose, qrcode } = this.props;
        // const { qrcode } = this.state
        // const screenHeight = parseInt(getWindowHeight())
        const screenWidth = parseInt(getWindowWidth())
        return (
            <View 
                style={{ 
                    height: `480px`, 
                    width: `${screenWidth*0.9}px` 
                }} 
                className={`${baseClass}`}
            >
                <canvas style="width: 375px; height: 400px;background:#fff" canvas-id="shareCanvas"></canvas>
                {/* <View className={`${baseClass}-qrcode`}>
                    <Image src={qrcode} mode='aspectFit' />
                </View> */}

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