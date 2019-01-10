const app = getApp()

Page({
  data: {
    bannerData: [],
    SITEURL: app.SITEURL,
    bannerWidth: "",
    bannerHeight: "",
    pageNum: 0,
    dataList: [],
    scrollViewHeight: 0,
    loadText: '加载中',
    isLoading: false,
  },
  onLoad(options){
    this.loadBanner(()=>{
      this.calcScrollView();
    });
    this.loadData();
  },
  loadBanner(cb){
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data:{
        model: 'getBanner',
        action: '{}'
      },
      success: (res)=>{
        this.setData({
          bannerData: res.data.data,
        })
        cb();
      }
    })
  },
  loadData(){
    if (this.data.isLoading) return false;
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
          rows: 10
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
  bannerImgLoad: function (e) {
    var windowObj = wx.getSystemInfoSync();
    var windowWidth = windowObj.screenWidth;
    var imageWidth = e.detail.width;
    var imageHeight = e.detail.height;

    var realHeight = windowWidth / imageWidth * imageHeight

    this.setData({
      bannerWidth: windowWidth,
      bannerHeight: realHeight
    })
  },
  calcScrollView(){
    var windowObj = wx.getSystemInfoSync();
    var windowHeight = windowObj.windowHeight;
    this.setData({
      scrollViewHeight: windowHeight-1
    })
  },
  toSingle(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/single/single?id=' + id,
    })
  }
})
