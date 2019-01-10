// pages/ucenter/ucenter.js
const app = new getApp();
var utils = require('../../utils/util.js');

Page({

  data: {
    isLogin: false,
    userInfo: {
      user_avatar: app.defaultAvatar,
      display_name: '请登录',
    },
    user_setting_text: '点击这里通过微信授权登录',
  },

  onLoad: function (options) {
    
  },
  onGotUserInfo (e) {
    if(!(e.detail.errMsg == 'getUserInfo:ok')) return false;
    var that = this;
    var wx_code = '';
    wx.showLoading({
      title: '登录中',
    })
    wx.login({
      success(res) {
        wx_code = res.code;
        if (e.detail.errMsg == "getUserInfo:ok") {
          wx.request({
            url: app.BASEAPIURL,
            method: 'post',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            data: {
              model: 'wxspAuth',
              action: JSON.stringify({
                wx_code: wx_code,
                ...e.detail.userInfo
              })
            },
            success: (res) => {
              wx.hideLoading();
              if(res.data.success){
                wx.setStorageSync('userInfo', res.data.data);
                that.setData({
                  isLogin: true,
                  userInfo: res.data.data,
                  user_setting_text: '查看或编辑个人资料',
                })
              }
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },
  jumpPage(e){
    var isAuth = e.currentTarget.dataset.auth
    if(this.data.isLogin){
      var page = e.currentTarget.dataset.page
      wx.navigateTo({
        url: '/pages/' + page + '/' + page,
      })
    }else{
      if (!isAuth){
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
      }
    }
  },
  onShow(){
    var userInfo = wx.getStorageSync("userInfo")
    utils.get_user((isLogin) => {
      if (isLogin){
        this.setData({
          isLogin: true,
          userInfo: userInfo,
          user_setting_text: '查看或编辑个人资料',
        })
      }else{
        this.setData({
          userInfo: {
            user_avatar: app.defaultAvatar,
            display_name: '请登录',
          },
          user_setting_text: '点击这里通过微信授权登录',
          isLogin: false,
        })
      }
    });
  }
})