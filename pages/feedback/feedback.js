const app = getApp();
var utils = require('../../utils/util.js');
import verify from '../../utils/verify.js'

Page({
  data: {
    post_title: '',
    post_content: '',
    userInfo: {}
  },
  onLoad: function (options) {
    this.data.userInfo = wx.getStorageSync('userInfo');
    if (this.data.userInfo) {
      this.setData({
        userInfo: this.data.userInfo
      })
    }
  },
  inputFunc(e) {
    this.data[e.currentTarget.dataset.name] = e.detail.value;
  },
  submitData(){
    var verifyCon = [
      ['post_title', 'isEmpty', this.data.post_title, '标题不能为空'],
      ['post_content', 'isEmpty', this.data.post_content, '内容不能为空'],
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
        model: 'publishPost',
        action: JSON.stringify({
          user_id: this.data.userInfo.ID,
          token: this.data.userInfo.token,
          post_title: this.data.post_title,
          post_content: this.data.post_content,
          post_type: 'topic',
          post_status: 'publish',
          post_category: [7]
        })
      },
      success: (res) => {
        wx.hideLoading();
        wx.showToast({
          title: res.data.message,
          icon: 'none',
        })
        if (res.data.success) {
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