const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router()
const { controller, get, post, put } = require('../lib/decorator')
const { getAllBooks, getBookDetail, getRelativeBooks } = require('../service/book')

@controller('/api/v0/books')
export class bookController {
  @get('/')
  async getBooks (ctx, next) {
    // const { category, pageSize, sort } = ctx.query
    const books = await getAllBooks()
    
    ctx.body = {
      books
    }
  }

  @get('/:id')
  async getBookDetail (ctx, next) {
    // const Book = mongoose.model('Book')
    // const id = ctx.params.id
    // const books = await Book.find({ _id: id })

    const id = ctx.params.id
    const book = await getBookDetail(id)
    //拿到同类的书籍
    const relativeBooks = await getRelativeBooks(book)

    ctx.body = {
      data: {
        book,
        relativeBooks
      },
      success: true
    }
  }
}

// const book = new bookController()
// book.getBooks()
// module.exports = router