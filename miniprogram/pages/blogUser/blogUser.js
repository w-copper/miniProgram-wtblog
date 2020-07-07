// miniprogram/pages/blogUser/blogUser.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: null,
    avatarUrl:'',
  },

  onNewBlog: function() {
    app.globalData.blogId = null
    wx.navigateTo({
      url: '../blogEdit/blogEdit',
    })
  },

  onUserList: function() {
    app.globalData.currentUser = true
    app.globalData.blogDone = true
    app.globalData.blogMyself = false
    wx.navigateTo({
      url: '../blogList/blogList',
    })
  },

  onCheckOld: function() {
    app.globalData.currentUser = true
    app.globalData.blogDone = false
    app.globalData.blogMyself = false
    wx.navigateTo({
      url: '../blogList/blogList',
    })
  },

  onUserSelf: function() {
    app.globalData.currentUser = true
    app.globalData.blogMyself = true
    app.globalData.blogDone = true
    wx.navigateTo({
      url: '../blogList/blogList',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData)
    this.setData({
      openid: app.globalData.openid,
      avatarUrl: app.globalData.avatarUrl
    })
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
    // app.globalData.blogMyself = false
    // app.globalData.blogDone = true
    // app.globalData.currentUser = false
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('unload!')
    app.globalData.blogMyself = false
    app.globalData.blogDone = true
    app.globalData.currentUser = false
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