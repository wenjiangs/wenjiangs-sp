const app = getApp();
var utils = require('../../utils/util.js');

Page({
  data: {
    msgList: [],
    content: '',
    dialogue: {},
  },
  onLoad: function (options) {
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
    if(!utils.isEmpty(options.id)){
      this.data.accept_id = options.id;
    }
  },
  onShow: function () {
    this.getMessages();
    this.getUser();
  },
  getMessages(){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        model: 'getMessages',
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
            msgList: res.data.data,
          })
        }
      }
    })
  },
  getUser(){
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
            dialogue: res.data.data,
          })
          wx.setNavigationBarTitle({
            title: res.data.data.display_name,
          })
        }
      }
    })
  },
  conInput(e){
    this.setData({
      content: e.detail.value
    })
  },
  sendMessage(){
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        model: 'sendMessage',
        action: JSON.stringify({
          user_id: this.data.userInfo.ID,
          token: this.data.userInfo.token,
          send_id: this.data.userInfo.ID,
          accept_id: this.data.accept_id,
          content: this.data.content,
        })
      },
      success: (res) => {
        if (res.data.success) {
          this.data.msgList.push(res.data.data);
          this.setData({
            msgList: this.data.msgList,
            content: '',
          })
        }
      }
    })
  }
})