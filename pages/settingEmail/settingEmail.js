const app = getApp();
var utils = require('../../utils/util.js');
import verify from '../../utils/verify.js'

Page({
  data: {
    userInfo: {},
    user_email: '',
    email_code: '',
    emailText: utils.emailText,
    timeObj: {},
  },
  onLoad: function (options) {
    this.data.userInfo = wx.getStorageSync('userInfo');
    if (this.data.userInfo) {
      this.setData({
        user_email: this.data.userInfo.user_email,
      })
    }
    this.data.timeObj = setInterval(()=>{
      this.setData({
        emailText: utils.emailText
      })
    }, 1000)
  },
  inputFunc(e) {
    this.data[e.currentTarget.dataset.name] = e.detail.value;
  },
  getEmailCode(){
    utils.getEmailCode(this.data.user_email);
  },
  submitData(){
    var verifyCon = [
      ['userEmail', 'isEmpty', this.data.user_email, '邮箱地址不能为空'],
      ['userEmail', 'CheckEmail', this.data.user_email, '邮箱格式不正确'],
      ['sendCode', 'isEmpty', this.data.email_code, '验证码不能为空'],
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
        model: 'updateUser',
        action: JSON.stringify({
          user_id: this.data.userInfo.ID,
          token: this.data.userInfo.token,
          meta_name: 'user_email',
          meta_value: this.data.user_email,
          email_code: this.data.email_code
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
          this.data.userInfo.user_email = this.data.user_email;
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
  onHide(){
    clearInterval(this.data.timeObj);
  }
})