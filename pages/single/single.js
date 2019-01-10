// pages/single/single.js
const app = getApp()
var WxParse = require('../../components/wxParse/wxParse.js');

Page({
  data: {
    post: [],
    post_content: [],
    comment: [],
    comment_content: [],
    loadText: '加载中',
    windowWidth: 0,
    scrollViewHeight: 0,
    pageNum: 0,
    postID: 0,
    noMore: false,
    newCommentContent: '',
    userInfo: {},
    isLogin: false,
    showMask: false,
    showCF: false,
    apiUrl: '',
    postType: 'post',
    collectionText: '收藏',
    userID: 0
  },
  onLoad: function (options) {
    var windowObj = wx.getSystemInfoSync();
    this.data.windowWidth = windowObj.screenWidth;
    this.data.scrollViewHeight = windowObj.windowHeight;

    this.data.userInfo = wx.getStorageSync('userInfo');
    if (this.data.userInfo){
      this.setData({
        isLogin: true,
        userInfo: this.data.userInfo,
        userID: this.data.userInfo.ID
      })
    }

    this.data.postID = options.id;
    this.setData({
      scrollViewHeight: this.data.scrollViewHeight - 120 / 750 * this.data.windowWidth
    })

    if ("type" in options){
      this.data.postType = options.type;
    }

    this.get_post((res)=>{
      this.calcCollection();
    });
    this.get_comment();

  },
  get_post(cb){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        model: 'getPost',
        action: JSON.stringify({
          postID: this.data.postID,
          userID: this.data.userID,
          postType: this.data.postType
        })
      },
      success: (res)=>{
        this.setData({
          post: res.data.data
        })
        WxParse.wxParse('post_content', 'html', res.data.data.content, this, 24 / 750 * this.data.windowWidth);
        setTimeout(()=>{ wx.hideLoading()}, 500);
        cb(res.data);
      }
    })
  },
  get_comment(){
    this.data.pageNum++
    if (this.data.noMore) return false;
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data:{
        model: 'getComments',
        action: JSON.stringify({
          postID: this.data.postID,
          userID: this.data.userID,
          page: this.data.pageNum,
        })
      },
      success: (res) => {
        this.data.comment.push(...res.data.data)
        if (res.data.data.length < 10){
          this.setData({
            noMore: true,
            loadText: '没有更多了',
          })
        }
        for (let i = 0; i < res.data.data.length; i++){
          WxParse.wxParse('temContent', 'html', res.data.data[i].comment_content, this, 24 / 750 * this.data.windowWidth);
          this.data.comment_content.push(this.data.temContent);
        }
        this.setData({
          comment_content: this.data.comment_content,
          comment: this.data.comment
        })
        setTimeout(() => { wx.hideLoading() }, 500);
      }
    })
  },
  showCommentForm(){
    if(this.data.userInfo){
      this.setData({
        showCF: true,
        showMask: true,
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none',
      })
    }
  },
  hidePopup(){
    this.setData({
      showCF: false,
      showMask: false,
    })
  },
  checkComment(e){
    if (this.data.newCommentContent==''){
      wx.showToast({
        title: '评论不能为空',
        icon: 'none'
      })
      return false;
    }
    this.submitComment();
  },
  submitComment(){
    wx.showLoading({
      title: '提交中',
    })
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      data: {
        model: 'postComment',
        action: JSON.stringify({
          user_id: this.data.userInfo.ID,
          comment_author_email: this.data.userInfo.user_email,
          comment_author: this.data.userInfo.display_name,
          comment_content: this.data.newCommentContent,
          comment_post_ID: this.data.postID,
          comment_parent: 0,
          token: this.data.userInfo.token
        })
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: (res)=>{
        wx.hideLoading();
        wx.showToast({
          title: res.data.message,
          icon: 'none',
        })
        if (res.data.success){
          WxParse.wxParse('temContent', 'html', res.data.data.comment_content, this, 24 / 750 * this.data.windowWidth);
          this.data.post.comment_count++;
          this.setData({
            comment: [res.data.data, ...this.data.comment],
            comment_content: [this.data.temContent, ...this.data.comment_content],
            showCF: false,
            showMask: false,
            newCommentContent: '',
            post: this.data.post
          })
        }
      }
    })
  },
  commentInput(e){
    this.setData({
      newCommentContent: e.detail.value
    })
  },
  sharePost(){
    wx.showToast({
      title: '开发中',
      icon: 'none'
    })
  },
  collection(){
    if (!this.data.userInfo){
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '/pages/ucenter/ucenter',
        })
      }, 1500)
      return false;
    }
    wx.showLoading({
      title: '请稍后',
    })
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        model: 'collection',
        action: JSON.stringify({
          token: this.data.userInfo.token,
          user_id: this.data.userInfo.ID,
          item_id: this.data.postID,
          item_type: this.data.postType,
        })
      },
      success: (res)=>{
        if(res.data.success){
          if (res.data.code == 1){
            this.data.post.collection++;
            this.data.collectionText = '已收藏';
          } else if (res.data.code == 2){
            this.data.post.collection--;
            this.data.collectionText = '收藏';
          }
          this.setData({
            post: this.data.post,
            collectionText: this.data.collectionText
          })
        }
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
        setTimeout(()=>{ wx.hideLoading(); }, 500)
      }
    })
  },
  calcCollection() {
    if (!this.data.userInfo) {
      return false;
    }
    if (this.data.post.collection_current){
      this.setData({
        collectionText: '已收藏'
      })
    }
  }
})