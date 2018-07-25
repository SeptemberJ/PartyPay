import h from '../../utils/url.js'
import util from '../../utils/util.js'
var app = getApp()
Page({
  data: {
    yearDefault:'',
    year:'',
    loadingHidden:false
  },
  onLoad: function (options) {
    let curDate = new Date()
    let Year = curDate.getFullYear().toString()
    let Month = util.formatNumber(curDate.getMonth() + 1).toString()
    this.setData({
      year: Year + '-' + Month,
      yearDefault: Year
    })
  },
  onShow: function () {
    this.getRecord()
  },
  bindDateChange: function (e) {
    this.setData({
      year: e.detail.value
    })
  },
  toSearch: function(){
    this.getRecord()
  },
 
  //获取缴费记录
  getRecord: function() {
    this.setData({
      loadingHidden: false
    })
    util.wxPromisify(wx.request)({
      url: h.main + '/selectorder1.do',
      data: {
        date: this.data.year,
        openid: app.globalData.oppenid
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((res) => {
      console.log('获取缴费记录backInfo P----')
      console.log(res.data)
      let temp = res.data
      res.data.map(function(item,idx){
        temp[idx].date1 = item.date1.substring(0,7)
        temp[idx].subdate = item.subdate.substring(0, 10)
      })
      this.setData({
        record: temp,
        loadingHidden: true
      })
      
    }).catch((res) => {
      console.error('获取缴费记录failed')
      console.error(res)
    })
  },
  //下载回执
  downLoad: function(e){
    this.setData({
      loadingHidden: false
    })
    let Fimage = e.currentTarget.dataset.fimage
    wx.downloadFile({
      url: Fimage, //仅为示例，并非真实的资源
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res) => {
            this.setData({
              loadingHidden: true
            })
            wx.showToast({
              title: '下载成功!',
              icon: 'success',
              duration: 2000
            })
          },
          fail: (res) => {
            console.log(res)

          }
        })
      }
    })
 
    
  }
 
})