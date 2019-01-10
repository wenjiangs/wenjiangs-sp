const app = getApp();
var utils = require('../../utils/util.js');

Page({
  data: {
    author: {},
    showMore: false,
    dataType: 1,
    pageNum: 0,
    rows: 10,
    dataList: [],
    loadText: '加载中',
    isLoading: false,
    scrollViewHeight: 0,
  },
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo')
    if (!utils.isEmpty(userInfo)) {
      this.setData({
        userInfo: userInfo
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
    if (!utils.isEmpty(options.id)) {
      this.data.accept_id = options.id;
    }
    var windowObj = wx.getSystemInfoSync();
    var windowHeight = windowObj.windowHeight;
    this.setData({
      scrollViewHeight: windowHeight - 1
    })
    this.getUser();
    this.loadData();
  },
  getUser() {
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        model: 'getUser',
        action: JSON.stringify({
          user_id: this.data.userInfo.ID,
          token: this.data.userInfo.token,
          accept_id: this.data.accept_id,
        })
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.success) {
          this.setData({
            author: res.data.data,
          })
          wx.setNavigationBarTitle({
            title: res.data.data.display_name,
          })
        }
      }
    })
  },
  isShowMore(){
    this.setData({
      showMore: !this.data.showMore
    }) 
  },
  tabClick(e){
    this.setData({
      dataType: e.currentTarget.dataset.type
    })
    this.setData({
      noMore: false,
      loadText: '加载中',
      dataList: [],
      pageNum: 0,
    })
    this.loadData();
  },
  loadData(){
    if(this.data.dataType==1){
      this.getPosts();
    } else if (this.data.dataType == 2) {
      this.getComments();
    } else if (this.data.dataType == 3) {
      this.getDocs();
    } else if (this.data.dataType == 4) {
      this.getTopics();
    } else {
      this.getReplys();
    }
  },
  getPosts(){
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
        model: 'getPosts',
        action: JSON.stringify({
          page: this.data.pageNum,
          rows: this.data.rows,
          user_id: this.data.userInfo.ID,
          userID: this.data.accept_id,
          token: this.data.userInfo.token,
          dataType: this.data.dataType,
          sp: 1
        })
      },
      success: (res) => {
        if (res.data.data.length < this.data.rows) {
          this.setData({
            noMore: true,
            loadText: '没有更多了'
          })
        }
        this.data.isLoading = false;
        this.data.dataList.push(...res.data.data);
        this.setData({
          dataList: this.data.dataList,
        })
        setTimeout(() => { wx.hideLoading(); }, 1000)
      }
    })
  },
  getComments() {
    
  },
  getDocs() { },
  getTopics() { },
  getReplys() { },
  toSingle(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/single/single?id=' + id,
    })
  },
})