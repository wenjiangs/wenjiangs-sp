const app = getApp()
var utils = require('../../utils/util.js');
import verify from '../../utils/verify.js'

Page({
  data: {
    region: ['', '', ''],
    location: '',
    userInfo: {},
    addressDetailed: '',
  },
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    if (!utils.isEmpty(userInfo)){
      this.setData({
        region: userInfo.location.split(' '),
        location: userInfo.location,
        userInfo: userInfo
      })
    }
  },
  bindRegionChange(e){
    this.setData({
      region: e.detail.value,
      location: e.detail.value.join(' '),
    })
  },
  inputFunc(e){
    this.data.addressDetailed = e.detail.value
  },
  submitForm(){
    var verifyCon = [
      ['adr', 'isEmpty', this.data.location, '请选择省市区'],
      ['adr', 'isEmpty', this.data.addressDetailed, '请填写详细地址'],
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
        model: 'updateUserMeta',
        action: JSON.stringify({
          user_id: this.data.userInfo.ID,
          token: this.data.userInfo.token,
          meta_name: 'location',
          meta_value: this.data.location + ' ' + this.data.addressDetailed
        })
      },
      success: (res) => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
        })
        if (res.data.success) {
          this.data.userInfo.location = this.data.location + ' ' + this.data.addressDetailed;
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