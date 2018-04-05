const Koa = require('koa')
const mongoose = require('mongoose')
const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')
const book_router = require('./routes/book')

;(async () => {
  await connect()

  initSchemas()                    //初始化schemas

  // require('./trasks/books')        //初始化books的内容
  require('./trasks/book_detail')  //获取books的精细内容
  // require('./trasks/tags_init.js') //初始化books的分类tags、初始化tags表的内容
  
  const app = new Koa()
  
  app
    .use(book_router.routes())
    .use(book_router.allowedMethods())
  
  app.listen(4455)
})()

 

