const app = getApp();
var WxParse = require('../../components/wxParse/wxParse.js');

Page({
  data: {
    scrollViewHeight: 0,
    dataType: 1,
    pageNum: 0,
    rows: 10,
    dataList: [],
    loadText: '加载中',
    isLoading: false,
    comment_content: [],
    temContent: [],
    windowWidth: 0,
    noMore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.userInfo = wx.getStorageSync('userInfo');
    if (this.data.userInfo) {
      this.setData({
        userInfo: this.data.userInfo,
      })
    }
    this.calcScrollView();
    this.loadData();
  },
  calcScrollView() {
    var windowObj = wx.getSystemInfoSync();
    this.data.windowWidth = windowObj.windowWidth;
    this.setData({
      scrollViewHeight: windowObj.windowHeight - 84 / 750 * windowObj.windowWidth - 1
    })
  },
  tabClick(e){
    if (this.data.dataType == e) return;
    this.setData({
      dataType: e.target.dataset.datatype
    })
    this.data.pageNum = 0;
    this.data.noMore = false;
    this.data.dataList = [];
    this.data.comment_content = [];
    this.loadData();
    // 重新加载列表
  },
  loadData() {
    if (this.data.isLoading || this.data.noMore) return;
    this.data.isLoading = true;
    wx.showLoading({
      title: '加载中',
    })
    this.data.pageNum++;
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        model: 'userComments',
        action: JSON.stringify({
          page: this.data.pageNum,
          rows: this.data.rows,
          user_id: this.data.userInfo.ID,
          token: this.data.userInfo.token,
          dataType: this.data.dataType,
          post_type: 'post',
          sp: 1
        })
      },
      success: (res) => {
        if (res.data.data.length < this.data.rows){
          this.setData({
            noMore: true,
            loadText: '没有更多了'
          })
        }
        this.data.isLoading = false;
        for (let i = 0; i < res.data.data.length; i++) {
          WxParse.wxParse('temContent', 'html', res.data.data[i].comment_content, this, 24 / 750 * this.data.windowWidth);
          this.data.comment_content.push(this.data.temContent);
        }
        this.data.dataList.push(...res.data.data);
        this.setData({
          dataList: this.data.dataList,
          comment_content: this.data.comment_content,
        })
        setTimeout(() => { wx.hideLoading(); }, 1000)
      }
    })
  },
})