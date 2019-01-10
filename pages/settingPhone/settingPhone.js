const app = getApp();
var utils = require('../../utils/util.js');
import verify from '../../utils/verify.js'

Page({
  data: {
    userInfo: {},
    mobile_phone: '',
    sms_code: '',
    smsText: utils.smsText,
    timeObj: {},
  },
  onLoad: function (options) {
    this.data.userInfo = wx.getStorageSync('userInfo');
    if (this.data.userInfo) {
      this.setData({
        mobile_phone: this.data.userInfo.mobile_phone,
      })
    }
    this.data.timeObj = setInterval(() => {
      this.setData({
        smsText: utils.smsText
      })
    }, 1000)
  },
  inputFunc(e) {
    this.data[e.currentTarget.dataset.name] = e.detail.value;
  },
  getSmsCode() {
    utils.getSmsCode(this.data.mobile_phone);
  },
  submitData() {
    var verifyCon = [
      ['phone', 'isEmpty', this.data.mobile_phone, '手机号不能为空'],
      ['phone', 'CheckMoble', this.data.mobile_phone, '手机号不正确'],
      ['sendCode', 'isEmpty', this.data.sms_code, '验证码不能为空'],
    ];
    var verifyRes = verify(verifyCon, true)
    if (verifyRes) {
      wx.showToast({
        title: verifyRes[3],
        icon: 'none'
      })
      return false;
    }
    wx.showLoading({
      title: '提交中',
    })
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        model: 'updateUserMeta',
        action: JSON.stringify({
          user_id: this.data.userInfo.ID,
          token: this.data.userInfo.token,
          meta_name: 'mobile_phone',
          meta_value: this.data.mobile_phone,
          sms_code: this.data.sms_code
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
          this.data.userInfo.mobile_phone = this.data.mobile_phone;
          wx.setStorageSync("userInfo", this.data.userInfo);
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      }
    })
  },
  onHide() {
    clearInterval(this.data.timeObj);
  }
})