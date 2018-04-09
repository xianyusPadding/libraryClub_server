const Koa = require('koa')
const mongoose = require('mongoose')
const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')
const book_router = require('./routes/book')
const user_router = require('./routes/user')
const article_router = require('./routes/article')
const order_router = require('./routes/order')
const bodyparser = require('koa-bodyparser')

;(async () => {
  await connect()

  initSchemas()                    //初始化schemas

  // require('./trasks/books')        //初始化books的内容
  // require('./trasks/book_detail')  //获取books的精细内容
  // require('./trasks/tags_init.js') //初始化books的分类tags、初始化tags表的内容
  // require('./trasks/articles-list')//初始化articles的内容
  // require('./trasks/article-detail.js')    //初始化articlesd的精细内容
  
  const app = new Koa()
  
  app
    .use(bodyparser())
    .use(book_router.routes())
    .use(book_router.allowedMethods())
    .use(user_router.routes())
    .use(user_router.allowedMethods())
    .use(article_router.routes())
    .use(article_router.allowedMethods())
    .use(order_router.routes())
    .use(order_router.allowedMethods())
  
  app.listen(4455)
})()

 

