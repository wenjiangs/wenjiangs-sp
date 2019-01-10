// pages/docs/docs.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 0,
    dataList: [],
    scrollViewHeight: 0,
    loadText: '加载中',
    windowWidth: 0,
    isLoading: false,
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
    this.loadData();
  },
  loadData(){
    if (this.data.isLoading) return false;
    this.data.isLoading = false;
    wx.showLoading({
      title: '加载中',
    })
    this.data.pageNum++;
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data:{
        model: 'getCategories',
        action: JSON.stringify({
          page: this.data.pageNum,
          rows: 10,
          taxonomy: 'docs'
        })
      },
      success: (res) => {
        this.data.isLoading = false;
        if (res.data.success){
          this.data.dataList.push(...res.data.data);
          this.setData({
            dataList: this.data.dataList,
          })
        }
        if (res.data.data.length<10){
          this.setData({
            loadText: '没有更多了'
          })
        }
        setTimeout(() => { wx.hideLoading(); }, 1000)
      }
    })
  },
  toDocs(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/docsSingle/docsSingle?id=' + id,
    })
  }
})