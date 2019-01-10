const app = getApp();
var utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navIndex: 1,
    viewList: [],
    userInfo: {},
    chatList: [],
    contactsList: [],
    searchList: [],
    sText: '',
    rows: 20,
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo')
    if (!utils.isEmpty(userInfo)){
      this.setData({
        userInfo: userInfo
      })
    }else{
      wx.switchTab({
        url: '/pages/ucenter/ucenter',
      })
    }
  },
  tabClick(e){
    var i = e.currentTarget.dataset.i;
    this.setData({
      navIndex: i,
      viewList: [],
    })
    if (i==1){
      this.getChatList();
    }else if(i==2){
      this.getContacts();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.navIndex==1){
      this.getChatList();
    }else if(this.data.navIndex==2){
      this.getContacts();
    }
  },
  getChatList(){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        model: 'getChatList',
        action: JSON.stringify({
          user_id: this.data.userInfo.ID,
          token: this.data.userInfo.token,
        })
      },
      success: (res) => {
        wx.hideLoading();
        if(res.data.success){
          this.data.chatList = res.data.data;
          this.setData({
            viewList: res.data.data,
          })
        }
      }
    })
  },
  getContacts() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        model: 'getContacts',
        action: JSON.stringify({
          user_id: this.data.userInfo.ID,
          token: this.data.userInfo.token,
        })
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.success) {
          this.data.contactsList = res.data.data;
          this.setData({
            viewList: res.data.data,
          })
        }
      }
    })
  },
  searchInput(e){
    this.data.sText = e.detail.value;
  },
  searchUser() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        model: 'searchUser',
        action: JSON.stringify({
          user_id: this.data.userInfo.ID,
          token: this.data.userInfo.token,
          rows: this.data.rows,
          page: this.data.page,
          s: this.data.sText
        })
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.success) {
          this.data.searchList = res.data.data;
          this.setData({
            viewList: res.data.data,
          })
        }
      }
    })
  },
  toSingle(e){
    wx.navigateTo({
      url: '/pages/messageSingle/messageSingle?id=' + e.currentTarget.dataset.id,
    })
  }
})