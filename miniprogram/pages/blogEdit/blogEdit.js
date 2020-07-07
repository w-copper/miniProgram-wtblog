// miniprogram/pages/blogEdit/blogEdit.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasPer: true,
    preOrMark: '预览',
    openid:null,
    blogid:null,
    title: '标题',
    createTime: null,
    showMarkdown:true,
    showPreview:false,
    abstract: '',
    htmlSnip: '',
    markdownValue: '',
    tags: [],
    done: true,
    myself: false,
  },
  /**
   * @param {openid} 用户id
   * @param {blogid} _id, 文章唯一标识
   * @param {title} 标题
   * @param {createTime} 创建时间，以整数存储
   * @param {editTime} 编辑时间，当前时间，以整数存储
   * @param {done} boolean 是否已完成
   * @param {tags} 数组，一组tag
   * @param {myself} 是否私有 
   */


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let blogid = app.globalData.blogId || null

    if (blogid !== null) {
      wx.showLoading({
        title: '加载中...',
      })
      const db = wx.cloud.database()
      db.collection('blog').doc(blogid).get().then(res => {
        if(res.data.openid !== app.globalData.openid) {
          this.setData({
            hasPer: false
          })
          wx.hideLoading({
            success: (res) => {},
          })
          return
        }
        const {
          title, createTime, tags, myself, abstract
        } = res.data
        this.setData({
          openid: getApp().globalData.openid,
          blogid: blogid,
          markdownValue: res.data.value,
         title, createTime, tags , myself, abstract
        })
        wx.hideLoading({
          success: (res) => {},
        })
        // res.data[0].value
      })
    }
    this.setData({
      openid: getApp().globalData.openid,
      blogid: blogid
    })
  },
  onSave: function() {
    const db = wx.cloud.database();
    const current = new Date().getTime()
    if (this.data.blogid === null) {
      db.collection('blog').add({
        data: {
          openid: this.data.openid,
          createTime: current,
          editTime: current,
          tags:this.data.tags,
          title: this.data.title,
          done: this.data.done,
          myself: this.data.myself,
          value: this.data.markdownValue,
          abstract: this.data.abstract
        }
      }).then(res => {
        console.log('保存成功！');
        wx.navigateBack({
          delta: 1,
        })
      }).catch(e => console.error)
    }
    else {
      db.collection('blog').doc(this.data.blogid).update({
        data: {
          editTime: current,
          tags: this.data.tags,
          done: this.data.done,
          myself: this.data.myself,
          done: this.data.done,
          abstract: this.data.abstract
        }
      }).then(res => {
        console.log('保存成功！');
        wx.navigateBack({
          delta: 1,
        })
      }).catch(e => console.error)
    }
    
  },

  onSaveNotDone: function() {
    this.setData({
      done: false
    })
    this.onSave()
  },

  onTitleChange: function(e) {
    this.setData({
      title: e.detail.value
    })

  },

  onAbsChange: function(e) {
    this.setData({
      abstract: e.detail.value
    })
  },

  onMyselfChange: function(e) {
    this.setData({
      myself:!e.detail.value
    })
  },

  onPreview: function() {
    if (this.data.showPreview) {
      this.setData({
        preOrMark:'预览',
        showPreview: false,
        showMarkdown: true
      })
      return;
    }
    
    wx.cloud.callFunction({
      name: 'markdown',
      data: {
        value:this.data.markdownValue
      }
    }).then(res => {
      // console.log(res.result)
      this.setData({
        htmlSnip: res.result.html
      })
      // document.getElementById('preview').innerHTML = res.result.html
    })
    .catch(err => console.error)
    // document.getElementById('preview').innerHTML =.toHTML(value)
    this.setData({
      showMarkdown: false,
      showPreview: true,
      preOrMark: "Markdown"
    })
  },

  onMarkChange: function(e) {
    this.setData({
      markdownValue: e.detail.value
    })
    // console.log(e)
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