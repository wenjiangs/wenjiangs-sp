// pages/topic/topic.js
const app = getApp();
var WxParse = require('../../components/wxParse/wxParse.js');

Page({
  data: {
    pageNum: 0,
    dataList: [],
    scrollViewHeight: 0,
    loadText: '加载中',
    collectionText: "收藏",
    isLoading: false,
  },
  onLoad: function (options) {
    this.calcScrollView();
    this.loadData();
  },
  loadData() {
    if (this.data.isLoading) return false;
    this.data.isLoading = true;
    wx.showLoading({
      title: '加载中',
    })
    this.data.pageNum++;
    wx.request({
      url: app.BASEAPIURL,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: {
        model: 'getPosts',
        action: JSON.stringify({
          page: this.data.pageNum,
          rows: 20,
          postType: 'topic',
          taxonomy: 'group',
          sp: 1,
        })
      },
      success: (res) => {
        this.data.isLoading = false;
        if(res.data.success){
          this.data.dataList.push(...res.data.data);
          this.setData({
            dataList: this.data.dataList,
          })
          setTimeout(() => { wx.hideLoading(); }, 1000)
        }
      }
    })
  },
  calcScrollView() {
    var windowObj = wx.getSystemInfoSync();
    var windowHeight = windowObj.windowHeight;
    this.setData({
      scrollViewHeight: windowHeight - 1
    })
  },
  toSingle(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/single/single?id=' + id + '&type=topic',
    })
  },
  viewBigImage(e){
    var src = e.currentTarget.dataset.src;
    var imgList = e.currentTarget.dataset.list;
    wx.previewImage({
      current: src,
      urls: imgList
    })
  }
})