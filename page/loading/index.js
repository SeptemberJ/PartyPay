import h from '../../utils/url.js'
import util from '../../utils/util.js'
var app = getApp()
Page({
  data: {
    loadingHidden:false
    
  },
  
  onReady: function () {
    
  },


  onLoad: function (options) {
    //调用应用实例的方法获取全局数据
    app.getUserInfo((userInfo) => {
      this.setData({
        userInfo: userInfo,
        nickName: userInfo.nickName,
      })
    }) 
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
  // submitCertification: function () {
  //         util.wxPromisify(wx.request)({
  //           url: h.main+'/',
  //           data: {
  //             Certification:this.data.Certification
  //           },
  //           method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
  //           header: {
  //             'content-type': 'application/x-www-form-urlencoded',
  //             'Accept': 'application/json',
  //           },
  //         }).then((res) => {
  //           console.log('提交身份证号backInfo P-----');
  //           console.log(res)
  //           if (res.data==1){
  //             wx.switchTab({
  //               url: '../index/index',
  //             })
  //           }
  //         }).catch((res) => {
  //           console.error('提交身份证号failed')
  //           console.error(res)
  //         })
  // },
   
})