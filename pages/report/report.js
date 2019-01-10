const app = getApp();
var utils = require('../../utils/util.js');
import verify from '../../utils/verify.js'

Page({
  data: {
    report_type_arr: [
      '垃圾营销',
      '不实信息',
      '有害信息',
      '违法信息',
      '淫秽色情',
      '人身攻击我',
      '抄袭我的内容',
      '冒充我',
      '泄露我的隐私'
    ],
    report_type_index: 0,
    report_path: '',
    report_type: '',
    report_content: '',
    userInfo: {},
  },
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    if (!utils.isEmpty(userInfo)) {
      this.setData({
        userInfo: userInfo
      })
    }
  },
  bindPickerChange(e){
    this.setData({
      report_type: this.data.report_type_arr[e.detail.value],
      report_type_index: e.detail.value
    })
  },
  inputFunc(e){
    this.data[e.currentTarget.dataset.v] = e.detail.value;
  },
  checkForm(){
    var verifyCon = [
      ['p', 'isEmpty', this.data.report_path, '举报地址不能为空'],
      ['t', 'isEmpty', this.data.report_type, '举报类型不能为空'],
      ['c', 'isEmpty', this.data.report_content, '举报内容不能为空'],
    ];
    var verifyRes = verify(verifyCon, true)
    if (verifyRes) {
      wx.showToast({
        title: verifyRes[3],
        icon: 'none'
      })
      return false;
    }
    this.submitData();
  },
  submitData(){
    wx.showLoading({
      title: '提交中',
    })
    wx.request({
      url: app.BASEAPIURL,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        model: 'accusation',
        action: JSON.stringify({
          user_id: this.data.userInfo.ID,
          token: this.data.userInfo.token,
          accusation_path: this.data.report_path,
          accusation_type: this.data.report_type,
          accusation_content: this.data.report_content
        })
      },
      success: (res) => {
        wx.hideLoading();
        wx.showToast({
          title: res.data.message,
          icon: 'none',
        })
        if (res.data.success) {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      }
    })
  }
})