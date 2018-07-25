//app.js
import h from '/utils/url.js'
import util from './utils/util.js'

App({
  onLaunch: function () {
    console.log('App Launch')
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
  },


  onShow: function () {
    console.log('App Show')
   

  },
  getUserInfo: function (cb) {
    var that = this
    wx.login({
      success: function (a) {
        var code = a.code;
        console.log(code + "*******************")
        wx.getUserInfo({
          success: function (res) {
            console.log(res.encryptedData)
            var encryptedData = encodeURIComponent(res.encryptedData);
            var iv = res.iv;
            that.globalData.userInfo = res.userInfo
            that.globalData.code = code
            that.globalData.encryptedData = encryptedData
            that.globalData.iv = res.iv
            that.Login(code,encryptedData,iv);
            typeof cb == "function" && cb(that.globalData.userInfo)
          }
        })
      }
    })
  },
  onHide: function () {
    console.log('App Hide-------')
  },
  globalData: {
    userInfo: null,
    code: "",
    encryptedData: "",
    iv: "",
    oppenid: '',//oGm3u0FHjaAt6vFemoB3XF39RHbE
    IDCard:''
    

  },

  //Login
  Login: function (Code, EncryptedData, Iv) {
    console.log('开始登录----');
    // // var app = getApp();
    console.log(this.globalData.userInfo);
    console.log(Code)
    util.wxPromisify(wx.request)({
      url: h.main+'/userInsertWsc.do',
      data: {
        code: Code,
        realname: this.globalData.userInfo.nickName,
        head_img: this.globalData.userInfo.avatarUrl
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((res) => {
      console.log('登录信息backInfo P-----');
      console.log(res);
      if (res.data.isUrl == 2) {  //首次登录
        wx.redirectTo({
          url: '../sign/index',
        })
      }
      else if(res.data.isUrl == 1) {  //已经注册过
        wx.switchTab({
          url: '../index/index',
        })
      }
       else {
        wx.showToast({
          title: '系统繁忙!',
          image: '../../image/icon/attention.png',
          duration: 2000
        })
      }
      this.globalData.oppenid = res.data.oppen_id;
      this.globalData.IDCard = res.data.fscard;
      // this.globalData.fname = res.data.fname;
      // this.globalData.partybranch = res.data.partybranch;
      
    }).catch((res) => {
      console.error(res)
    })
  },
})

