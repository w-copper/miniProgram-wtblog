// 云函数入口文件
const cloud = require('wx-server-sdk')
const markdown = require('markdown').markdown
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const html = markdown.toHTML(event.value)
  // console.log(html)
  // event.html = html
  return {
    event,
    html
    // appid: wxContext.APPID,
    // html: html
  }
}