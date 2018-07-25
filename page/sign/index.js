import h from '../../utils/url.js'
import util from '../../utils/util.js'
var app = getApp()
Page({
  data: {
    Certification:'',
    loadingHidden:true
    
  },
  
  onReady: function () {
    
  },


  onLoad: function (options) {
    
        
  },


  onShow: function () {

  },
  changeCertification: function(e){
    this.setData({
      Certification:e.detail.value
    })
  },
  clearCertification: function () {
    this.setData({
      Certification: ''
    })
  },
  submitCertification: function () {
    if (this.data.Certification.trim()==''){
      wx.showToast({
        title: '身份证号不能为空!',
        image: '../../image/icon/attention.png',
        duration: 1000
      })
      return false
    }
    wx.showModal({
      title: '确认身份证号为：',
      content: this.data.Certification,
      success: (res)=> {
        if (res.confirm) {
          this.setData({
            loadingHidden:false
          })
          util.wxPromisify(wx.request)({
            url: h.main +'/updatefscard.do',
            data: {
              fscard:this.data.Certification,
              openid: app.globalData.oppenid
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
            },
          }).then((res) => {
            console.log('提交身份证号backInfo P-----');
            console.log(res)
            if (res.data==1){
              wx.switchTab({
                url: '../index/index',
              })
              this.setData({
                loadingHidden: true
              })
            }else{
              wx.showToast({
                title: '身份证号错误!',
                image: '../../image/icon/attention.png',
                duration: 2000
              })
              this.setData({
                loadingHidden: true
              })
            }
          }).catch((res) => {
            console.error('提交身份证号failed')
            console.error(res)
          })
        } else if (res.cancel) {
        }
      }
    })
  },
   
})