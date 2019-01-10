const app = getApp();
var utils = require('../../utils/util.js');

Page({
  data: {
    author: {},
    accept_id: 0,
    userInfo: {},
  },
  onLoad: function (options) {
    if(options.id){
      this.data.accept_id = options.id;
    }else{
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
    var userInfo = wx.getStorageSync('userInfo')
    if (!utils.isEmpty(userInfo)) {
      this.setData({
        userInfo: userInfo
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
    this.getUser();
  },
  getUser() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        model: 'getUser',
        action: JSON.stringify({
          user_id: this.data.userInfo.ID,
          token: this.data.userInfo.token,
          accept_id: this.data.accept_id,
        })
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.success) {
          this.setData({
            author: res.data.data,
          })
          wx.setNavigationBarTitle({
            title: res.data.data.display_name,
          })
        }
      }
    })
  },
})