const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router({
  prefix: '/api/v0/books'
})
const { getAllBooks, getBookDetail, getRelativeBooks, getBooksCount, updateBook, removeBook } = require('../service/book')

router.get('/all', async (ctx, next) => {
  //传入一个query category是类别 pageSize是每页的数量 sort是排序的方法  currPage当前页数量 easyState是否只取简单数据
  const { category, pageSize, sort, currPage, easyState } = ctx.query
  
  const books = await getAllBooks(category, pageSize, sort, currPage, easyState)
  const count = await getBooksCount()

  ctx.body = {
    count,
    books
  }
})

router.get('/ready', async (ctx, next) => {
  const Book = mongoose.model('Book')
  const books = await Book.find({
    publication_state: '正在印刷'
  }, {'title': 1, 'img_url': 1, 'author': 1, 'translator': 1} ).sort({'meta.createdAt': -1}).limit(10)

  ctx.body = {
    code: 0,
    books
  }
})

router.get('/detail/:id', async (ctx, next) => {
  const id = ctx.params.id
  const book = await getBookDetail(id)

  const relativeBooks = await getRelativeBooks(book)
  
  ctx.body = {
    book,
    relativeBooks
  }
})

router.post('/update', async (ctx, next) => {
  const { bookId, content } = ctx.request.body

  const data = await updateBook(bookId, content)
  
  ctx.body = data
})


router.post('/remove', async (ctx, next) => {
  const { bookId } = ctx.request.body

  const data = await removeBook(bookId)
  
  ctx.body = data
})

module.exports = router