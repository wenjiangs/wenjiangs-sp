const app = getApp()
var utils = require('../../utils/util.js');
import verify from '../../utils/verify.js'

Page({
  data: {
    userInfo: {},
  },
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    if (!utils.isEmpty(userInfo)) {
      this.setData({
        userInfo: userInfo,
      })
    }else{
      wx.redirectTo({
        url: '/pages/setting/setting',
      })
    }
  },
  inputFunc(e){
    this.data.userInfo.user_url = e.detail.value;
  },
  submitForm(){
    if(utils.isEmpty(this.data.userInfo.user_url)){
      wx.showToast({
        title: '请输入您的个人网址',
        icon: 'none',
      })
      return;
    }
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        model: 'updateUser',
        action: JSON.stringify({
          user_id: this.data.userInfo.ID,
          token: this.data.userInfo.token,
          meta_name: 'user_url',
          meta_value: this.data.userInfo.user_url,
        })
      },
      success: (res) => {
        wx.hideLoading();
        wx.showToast({
          title: res.data.message,
          icon: 'none',
        })
        if (res.data.success) {
          // 更新用户信息
          wx.setStorageSync("userInfo", this.data.userInfo);
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      }
    })
  }
})