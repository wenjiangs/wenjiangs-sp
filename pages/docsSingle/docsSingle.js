// pages/docsSingle/docsSingle.js
const app = getApp();
var WxParse = require('../../components/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    docsID: 0,
    docsSingle: [],
    cType: 3,
    windowWidth: 0,
    pageNum: 0,
    post: [],
    comment: [],
    comment_content: [],
    loadText: '加载中',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var windowObj = wx.getSystemInfoSync();
    this.data.windowWidth = windowObj.screenWidth;
    this.data.docsID = options.id;
    this.loadData();
    this.getDocsPost();
    this.getDocsComment();
  },
  loadData(){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.BASEAPIURL,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: {
        model: 'getCategory',
        action: JSON.stringify({
          catID: this.data.docsID,
          taxonomy: 'docs',
        })
      },
      success: (res) => {
        if (res.data.success) {
          this.setData({
            docsSingle: res.data.data,
          })
          WxParse.wxParse('docs_details', 'html', res.data.data.details, this, 24 / 750 * this.data.windowWidth);
        }
        setTimeout(() => { wx.hideLoading(); }, 1000)
      }
    })
  },
  changeTabs(e){
    this.setData({
      cType: e.currentTarget.dataset.type
    })
  },
  toSingle(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/single/single?id=' + id + '&type=doc',
    })
  },
  getDocsPost(){
    this.data.pageNum++;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.BASEAPIURL,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: {
        model: 'getPosts',
        action: JSON.stringify({
          page: this.data.pageNum,
          rows: 20,
          catID: this.data.docsID,
          postType: 'doc',
          taxonomy: 'docs',
        })
      },
      success: (res) => {
        if(res.data.success){
          this.data.post.push(...res.data.data);
          this.setData({
            post: this.data.post
          })
        }
      }
    })
  },
  getDocsComment(){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.BASEAPIURL,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: {
        model: 'getDocsComment',
        action: JSON.stringify({
          page: this.data.pageNum,
          rows: 20,
          catID: this.data.docsID
        })
      },
      success: (res) => {
        if(res.data.success){
          this.data.comment.push(...res.data.data);
          for(let i=0; i<res.data.data.length; i++){
            WxParse.wxParse('temContent', 'html', res.data.data[i].content, this, 24 / 750 * this.data.windowWidth);
            this.data.comment_content.push(this.data.temContent);
          }
          this.setData({
            comment: this.data.comment,
            comment_content: this.data.comment_content,
          })
          if(res.data.data.length < 20){
            this.setData({
              loadText: '没有更多了'
            })
          }
        }
      }
    })
  }
})