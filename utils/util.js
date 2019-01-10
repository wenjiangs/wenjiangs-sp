const app = getApp();
import verify from 'verify.js'

module.exports = {
  // 更新用户信息
  get_user(cb){
    var userInfo = wx.getStorageSync('userInfo');
    if (!this.isEmpty(userInfo)){
      wx.request({
        url: app.BASEAPIURL,
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data:{
          model: 'tokenVerification',
          action: JSON.stringify({
            token: userInfo.token,
            ID: userInfo.ID
          })
        },
        success: (res) => {
          if(res.data.success){
            cb(1);
          }else{
            wx.removeStorageSync("userInfo");
            cb(0);
          }
        }
      })
    }else{
      cb(0);
    }
  },
  isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
      return true;
    } else {
      return false;
    }
  },

  formatMoney(val) {
    //金额转换 分->元 保留2位小数 并每隔3位用逗号分开 1,234.56
    var str = (val / 100).toFixed(2) + '';
    var intSum = str.substring(0, str.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ',');//取到整数部分
    var dot = str.substring(str.length, str.indexOf("."))//取到小数部分搜索
    var ret = intSum + dot;
    return ret;
  },

  // 发送邮件验证码
  sendEmailCodeIng: false,
  emailText: '获取验证码',
  timeObj: {},
  getEmailCode(user_email) {
    var userInfo = wx.getStorageSync('userInfo');
    if (this.sendEmailCodeIng) return false;
    var verifyCon = [
      ['sendCode', 'isEmpty', user_email, '邮箱地址不能为空'],
      ['sendCode', 'CheckEmail', user_email, '邮箱格式不正确'],
    ];
    var verifyRes = verify(verifyCon, true)
    if (verifyRes) {
      wx.showToast({
        title: verifyRes[3],
        icon: 'none'
      })
      return false;
    }
    this.sendEmailCodeIng = true;
    wx.showLoading({
      title: '发送中',
    })
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        model: 'sendEmailCode',
        action: JSON.stringify({
          user_id: userInfo.ID,
          token: userInfo.token,
          user_email: user_email
        })
      },
      success: (res) => {
        wx.hideLoading()
        if (res.data.success) {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            confirmColor: '#0894ec'
          })
        }
      }
    })
    var seep = 0;
    this.timeObj = setInterval(() => {
      seep++
      this.emailText = (60 - seep) + "S后可重发"
      if (seep == 60) {
        clearInterval(this.timeObj);
        this.sendEmailCodeIng = false;
        this.emailText = "获取验证码";
      }
    }, 1000)
  },

  // 发送手机验证码
  sendSmsCodeIng: false,
  smsText: '获取验证码',
  timeObj: {},
  getSmsCode(mobile_phone) {
    var userInfo = wx.getStorageSync('userInfo');
    if (this.sendSmsCodeIng) return false;
    var verifyCon = [
      ['sendCode', 'isEmpty', mobile_phone, '手机号不能为空'],
      ['sendCode', 'CheckMoble', mobile_phone, '手机号格式不正确'],
    ];
    var verifyRes = verify(verifyCon, true)
    if (verifyRes) {
      wx.showToast({
        title: verifyRes[3],
        icon: 'none'
      })
      return false;
    }
    this.sendSmsCodeIng = true;
    wx.showLoading({
      title: '发送中',
    })
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        model: 'sendSmsCode',
        action: JSON.stringify({
          user_id: userInfo.ID,
          token: userInfo.token,
          mobile_phone: mobile_phone
        })
      },
      success: (res) => {
        wx.hideLoading()
        if (res.data.success) {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            confirmColor: '#0894ec'
          })
        }
      }
    })
    var seep = 0;
    this.timeObj = setInterval(() => {
      seep++
      this.smsText = (60 - seep) + "S后可重发"
      if (seep == 60) {
        clearInterval(this.timeObj);
        this.sendSmsCodeIng = false;
        this.smsText = "获取验证码";
      }
    }, 1000)
  },
}