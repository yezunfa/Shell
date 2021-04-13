import Taro, { Component } from '@tarojs/taro'
import { View, Button, Canvas } from '@tarojs/components'

class Test extends Component {

  componentDidMount() {
   
  }
  componentDidShow() {
   
  }

  async onPullDownRefresh() {
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

  openShareImg(){
    this.getSetting().then((res)=>{
      if(!res){
        this.showModal()
      }else{
        console.log('授权完成，可以生成海报');
        this.wxDrawImage(()=>{
          this.saveImage()
        })
      }
    }).catch(()=>{
      this.showModal()
    })
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

  downLoad () {
    let  that = this;
    that.openShareImg();
    // wx.downloadFile({
    //     url: 'https://bw-online-img.oss-cn-hangzhou.aliyuncs.com/miniprogram/home/06.png',
    //     success: function (res) {
    //         that.state.bgImgPath = res.tempFilePath;
    //         that.openShareImg();
    //     }
    // })
  }

  async wxDrawImage(callback){
    Taro.showLoading({ title: '海报生成中', mask: true });
    var ctx = Taro.createCanvasContext('shareCanvas',this.$scope)
    const imgPath1 = 'https://assets.51fusion.com/39aed86d-0a40-4335-935e-25939d2a6c6a.png';
    const imgPath2 = 'https://assets.51fusion.com/15c310cd-03f3-4f62-a372-632e6c1fed86.png'// filePath; // 小程序图片临时路径
    // const imgTempPath1 = await Taro.getImageInfo({ src: imgPath1 });
    // const imgTempPath2 = await Taro.getImageInfo({ src: imgPath2 });
    const imgTempPath1 = await Taro.downloadFile({ url: imgPath1 });
    const imgTempPath2 = await Taro.downloadFile({ url: imgPath2 });
    ctx.drawImage(imgTempPath1.tempFilePath, 0, 0, 375, 190);
    ctx.drawImage(imgTempPath2.tempFilePath, 250, 195, 86, 86);
    ctx.font = 'normal 11px ArialMT sans-serif';
    ctx.setFontSize(16);
    ctx.setFillStyle('#FF6066');
    ctx.fillText(`¥500`, 20, 310);
    ctx.font = 'normal 11px  PingFangSC-Regular sans-serif';
    ctx.setFontSize(12);
    ctx.setFillStyle('#FA2E9A');
    ctx.fillText('扫描小程序码查看', 245, 300);
    // ctx.draw(false);
    ctx.draw(true,()=>{
        callback && callback()
    })

  }


  render () {
   
    return (
      <View>
          <Button onClick={this.downLoad.bind(this)} >生成海报</Button>
          <Canvas canvasId="shareCanvas" style={{ width: '500px', height: '600px' }}></Canvas>
      </View>
    )
  }
}

export default Test
