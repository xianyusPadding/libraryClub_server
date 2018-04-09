const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router({
  prefix: '/api/v0'
})
const { getAllBooks, getBookDetail, getRelativeBooks, getBooksCount } = require('../service/book')

router.get('/books/all', async (ctx, next) => {
  console.log(ctx.query)
  //传入一个query category是类别 pageSize是每页的数量 sort是排序的方法  currPage当前页数量 easyState是否只取简单数据
  const { category, pageSize, sort, currPage, easyState } = ctx.query
  
  const books = await getAllBooks(category, pageSize, sort, currPage, easyState)
  const count = await getBooksCount()

  ctx.body = {
    count,
    books
  }
})

router.get('/books/detail/:id', async (ctx, next) => {
  const id = ctx.params.id
  const book = await getBookDetail(id)

  const relativeBooks = await getRelativeBooks(book)
  
  ctx.body = {
    book,
    relativeBooks
  }
})

module.exports = router