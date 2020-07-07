// miniprogram/pages/blogDetail/blogDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    userInfo: '',
    createTime: '',
    editTime: '',
    abstract: '',
    blogHtml: '',

    editAble: false,
    delAble: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { blogId } = app.globalData

    if(blogId) {
      wx.showLoading({
        title: '加载中...',
      })
      const db = wx.cloud.database()
      db.collection('blog')
      .doc(blogId)
      .get()
      .then(res => {
        let blogCurrent = false
        if(res.data.openid === app.globalData.openid) {
          blogCurrent = true
        }
        wx.cloud.callFunction({
          name: 'markdown',
          data: {
            value: res.data.value
          }
        }).then(res => {
          wx.hideLoading({
            success: (res) => {},
          })
          this.setData({
            blogHtml: res.result.html
          })
        })
        this.setData({
          title: res.data.title,
          createTime:  new Date(res.data.createTime).toDateString(),
          editTime: new Date(res.data.editTime).toDateString(),
          abstract: res.data.abstract,
          editAble: blogCurrent,
          delAble: blogCurrent
        })
      })
    }

  
  },

  onEdit: function() {
    wx.navigateTo({
      url: '../blogEdit/blogEdit',
    })
  },

  onDel: function() {
    const {blogId} = app.globalData
    if(blogId) {
      wx.showLoading({
        title: '删除中...',
      })
      const db = wx.cloud.database()
      db.collection('blog')
      .doc(blogId)
      .get()
      .then(res => {
        if(res.data.openid === app.globalData.openid) {
          db.collection('blog')
          .doc(blogId)
          .remove()
          .then(e => {
            wx.hideLoading({
              success: (res) => {},
            })
            wx.navigateBack({
              delta: 1,
            })
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})