// pages/page/page.js
const app = getApp();
var WxParse = require('../../components/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    tabIndex: 0,
    post_content: [],
    windowWidth: 0,
    scrollViewHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var windowObj = wx.getSystemInfoSync();
    this.data.scrollViewHeight = windowObj.windowHeight;
    this.data.windowWidth = windowObj.windowWidth;
    this.setData({
      scrollViewHeight: this.data.scrollViewHeight - 84 / 750 * this.data.windowWidth
    })
    this.loadList();
  },
  loadList(){
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        model: 'getPages',
        action: '{}'
      },
      success: (res) => {
        WxParse.wxParse('post_content', 'html',
        res.data.data[this.data.tabIndex].content, this, 24 / 750 * this.data.windowWidth);
        this.setData({
          dataList: res.data.data,
          post_content: this.data.post_content,
        })
      }
    })
  },
  clickTabs(e){
    WxParse.wxParse('post_content', 'html',
      this.data.dataList[e.currentTarget.dataset.index].content, this,
      24 / 750 * this.data.windowWidth);
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      post_content: this.data.post_content,
    })
  }
})