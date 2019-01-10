// pages/setting/setting.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      user_avatar: app.defaultAvatar,
      user_display_name: '请登录',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo){
      this.setData({
        userInfo: userInfo,
      })
    }
  },
  logOut(){
    wx.showModal({
      title: '提示',
      content: '确认退出登录吗？',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync("userInfo");
          wx.switchTab({
            url: '/pages/ucenter/ucenter',
          })
        }
      }
    })
  },
  jumpSetting(e) {
    var page = e.currentTarget.dataset.page
    wx.navigateTo({
      url: '/pages/' + page + '/' + page,
    })
  },
})