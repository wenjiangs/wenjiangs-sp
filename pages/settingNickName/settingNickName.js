// pages/settingNickName/settingNickName.js
const app = getApp()
var utils = require('../../utils/util.js');
import verify from '../../utils/verify.js'

Page({
  data: {
    userInfo: {},
    display_name: '',
  },
  onLoad (options) {
    this.data.userInfo = wx.getStorageSync('userInfo');
    if (this.data.userInfo){
      this.setData({
        display_name: this.data.userInfo.display_name,
      })
    }
  },
  inputFunc(e){
    this.data.display_name = e.detail.value;
  },
  submitForm(){
    var verifyCon = [
      ['sendCode', 'isEmpty', this.data.display_name, '请输入昵称'],
      ['sendCode', 'equalTo1', this.data.display_name, this.data.userInfo.display_name, '昵称未修改'],
    ];
    var verifyRes = verify(verifyCon, true)
    if (verifyRes) {
      wx.showToast({
        title: verifyRes[3],
        icon: 'none'
      })
      return false;
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
          meta_name: 'display_name',
          meta_value: this.data.display_name
        })
      },
      success: (res) => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
        })
        if (res.data.success){
          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      }
    })
  }
})