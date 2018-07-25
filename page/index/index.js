import h from '../../utils/url.js'
import util from '../../utils/util.js'
var app = getApp()
Page({
  data: {
    ifPayed:false,
    costList:[],
    fname:'',
    partybranch:'',
    loadingHidden:false
    
  },
  
  onReady: function () {
    
  },


  onLoad: function (options) {
  },


  onShow: function () {
    this.searchOrderStatusFisrt()
    

  },
  //缴纳
  toPay: function(e){
    let Idx = e.currentTarget.dataset.idx
    let forderno = e.currentTarget.dataset.forderno
    let Price = e.currentTarget.dataset.price
    this.setData({
      loadingHidden:false
    })
    this.weChatPay(forderno, Price)
  },
  // 微信支付
  weChatPay: function (orderNum, totalPrice) {
    console.log(typeof totalPrice)
    var bodyString = '党费缴纳-' + orderNum
    if (orderNum != '' && orderNum != null) {
      //微信支付
      wx.request({
        url: h.main + '/JsapiPay.do',
        data: {
          total_fee: Math.round(totalPrice * 100),// * 100
          out_trade_no: orderNum,
          body: bodyString.toString(),
          open_id: app.globalData.oppenid
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          // 'Accept': 'application/json',
        }, // 设置请求的 header
        success: (res) => {
          console.log('调起支付成功----')
          console.log(res)
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': 'MD5',
            'paySign': res.data.paySign,
            'success': (res) => {
              console.log('支付成功--')
              console.log(res)
              wx.showToast({
                title: '支付成功!',
                icon: 'success',
                duration: 1000
              })
              //支付成功修改订单状态
              this.modifyStatus(1, orderNum)
            },
            'fail': (res) => {
              console.log('支付失败--')
              console.log(res)
              //支付失败修改订单状态
              this.modifyStatus(0, orderNum)
              //this.searchOrderStatus(orderNum)
            },
            'complete': (res) => {
              console.log('支付complete--')
              console.log(res)
            },
          })

        },
        fail: (res) => {
                wx.showToast({
                title: '支付接口出错!',
                image: '../../image/icon/attention.png',
                duration: 2000
              })
          
        },
        complete: (res) => {
          this.setData({
            loadingHidden: true
          })
          // this.searchOrderStatus(orderNum)
        }
      })

    }
  },
  //查询订单
  searchOrderStatus: function (OrderNo) {
    util.wxPromisify(wx.request)({
      url: h.main + '/JsapiPayResult2.do',
      data: {
        out_trade_no: OrderNo
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((res) => {
      console.log('修改订单状态backInfo P----')
      console.log(res)
    }).catch((res) => {
      console.error('修改订单状态failed')
      console.error(res)
    })
  },

  //支付失败修改订单状态
modifyStatus: function (Status,Id){
  util.wxPromisify(wx.request)({
    url: h.main + '/insertorder.do',
    data: {
      status: Status,
      forder: Id,
      date: util.formatTime2(new Date())
    },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
  }).then((res) => {
    console.log('修改订单状态backInfo P----')
    console.log(res)
    this.getListData()
    // if (res.data == 1 && Status == 1) {
    //   let temp = this.data.costList
    //   temp.splice(Idx, 1)
    //   this.setData({
    //     costList: temp
    //   })
    // } else {
    //   wx.showToast({
    //     title: '支付失败!',
    //     image: '../../image/icon/attention.png',
    //     duration: 2000
    //   })
    // }
  }).catch((res) => {
    console.error('修改订单状态failed')
    console.error(res)
  })
  
},
//根据身份证号查订单
searchOrderStatusFisrt: function () {
  util.wxPromisify(wx.request)({
    url: h.main + '/JsapiPayResult2.do',
    data: {
      fscard: app.globalData.IDCard
    },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
  }).then((res) => {
    console.log('修改订单状态backInfo P----')
    console.log(res)
    this.getListData()
  }).catch((res) => {
    console.error('修改订单状态failed')
    console.error(res)
  })
},
getListData: function(){
  var requestOpenidPromisified = util.wxPromisify(wx.request);
  requestOpenidPromisified({
    url: h.main + '/selectorder.do',
    data: {
      openid: app.globalData.oppenid
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
  }).then((res) => {
    console.log('获取应缴费列表backInfo P-----');
    console.log(res.data)
    let temp = res.data[0]
    if (res.data[0].length > 0) {
      res.data[0].map(function (item, idx) {
        temp[idx].date = item.date.substring(0, 7)
      })
    }

    this.setData({
      fname: res.data[1].fname,
      partybranch: res.data[1].partybranch,
      costList: temp,
      loadingHidden: true
    })
    app.globalData.fname = res.data[1].fname;
    app.globalData.partybranch = res.data[1].partybranch;
  }).catch((res) => {
    console.error('获取应缴费列表failed')
    console.error(res)
  })
},
onPullDownRefresh() {
  this.getListData()
},
   
})