// pages/userPost/userPost.js
const app = getApp();
var utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 0,
    dataList: [],
    scrollViewHeight: 0,
    loadText: '加载中',
    userInfo: {},
    postStatus: [
      { text: '全部', code: ['publish', 'pending', 'draft', 'trash'] },
      { text: '已发布', code: 'publish' },
      { text: '待审核', code: 'pending' },
      { text: '草稿箱', code: 'draft' },
      { text: '回收站', code: 'trash' },
    ],
    currentTabs: 0,
    isLoading: false,
  },
  onLoad: function (options) {
    this.calcScrollView()
  },
  onShow(){
    this.data.userInfo = wx.getStorageSync("userInfo");
    utils.get_user((isLogin) => {
      if (!isLogin) {
        wx.redirectTo({
          url: '/pages/ucenter/ucenter',
        })
        return;
      }
    });
    this.loadData();
  },
  loadData() {
    if (this.data.isLoading) return;
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
          userID: this.data.userInfo.ID,
          postStatus: this.data.postStatus[this.data.currentTabs].code,
        })
      },
      success: (res) => {
        this.data.isLoading = false;
        this.data.dataList.push(...res.data.data);
        this.setData({
          dataList: this.data.dataList,
        })
        setTimeout(() => { wx.hideLoading(); }, 1000)
      }
    })
  },
  calcScrollView() {
    var windowObj = wx.getSystemInfoSync();
    var windowHeight = windowObj.windowHeight;
    this.setData({
      scrollViewHeight: windowHeight - 84 / 750 * windowObj.windowWidth - 1
    })
  },
  changeStatus(e){
    if (this.data.isLoading) return;
    this.setData({
      currentTabs: e.currentTarget.dataset.currenttabs
    })
    this.setData({
      dataList: [],
    })
    this.data.pageNum = 0;
    this.loadData();
  }
})