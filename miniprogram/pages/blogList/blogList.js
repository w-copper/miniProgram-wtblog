// miniprogram/pages/blogList/blogList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logged: false,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    searchValue: '',
    openid: null,

    /**
     * done 草稿
     * myself 私密
     * currentUser 自己的
     */

    done: false,
    myself: false,
    currentUser: false,

    sizePerpage: 10,
    orderBy: 'editTime',
    currentPage: 0,
    blogarr: []
  },


  searchBlog: function() {
    wx.showLoading({
      title: '加载中...',
    })
    const db = wx.cloud.database()
    const searchOptions = {
      done: this.data.done,
      myself: this.data.myself,
    }
    if (this.data.currentUser) {
      searchOptions.openid = this.data.openid
    }
    if (!!this.data.searchValue) {
      searchOptions.title = {
        $regex: '.*' + this.data.searchValue + '.*',
        $options: 'i'
      }
    }

    db.collection('blog').where(searchOptions)
    .orderBy(this.data.orderBy, 'asc')
    .skip(this.data.currentPage * this.data.sizePerpage)
    .limit(this.data.sizePerpage)
    .field({
      _id: true,
      title: true
    })
    .get()
    .then(res => {
      this.setData({
        blogarr: res.data
      })
      wx.hideLoading()
    })
    .catch(e => {
      wx.hideLoading()
    })

  },
  onClickItem: function(item) {
    // console.log(item.currentTarget.dataset.item)
    app.globalData.blogId = item.currentTarget.dataset.item._id
    wx.navigateTo({
      url: '../blogDetail/blogDetail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      logged: app.globalData.logged,
      openid: app.globalData.openid,
      // done: app.globalData.blogDone,
      // myself: app.globalData.blogMyself,
      // currentUser: app.globalData.currentUser,
      avatarUrl: app.globalData.avatarUrl || './user-unlogin.png'
    })
    // this.searchBlog()
  },
  onGetUserInfo: function(e) {
    if (!this.data.logged) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      this.onGetOpenid()
    }
    else {
      wx.navigateTo({
        url: '../blogUser/blogUser',
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.showLoading({
      title: '登陆中...',
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        // console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        app.globalData.avatarUrl = this.data.avatarUrl
        wx.hideLoading()
        wx.navigateTo({
          url: '../blogUser/blogUser',
        })
        app.globalData.logged = true
      },
      fail: err => {
        wx.hideLoading()
        this.setData({
          logged: false
        })
      }
    })
  },

  onConfirm: function(e) {
    // wx.navigateTo({
    //   url: '../blogEdit/blogEdit',
    // })
    this.setData({
      searchValue: e.detail.value
    })
    
    this.searchBlog()
  },
 
  onShow: function() {
    this.setData({
      // logged: app.globalData.logged,
      // openid: app.globalData.openid,
      done: app.globalData.blogDone,
      myself: app.globalData.blogMyself,
      currentUser: app.globalData.currentUser,
      // avatarUrl: app.globalData.avatarUrl || './user-unlogin.png'
    })
    this.searchBlog()
  },

})