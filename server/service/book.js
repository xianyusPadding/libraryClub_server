const mongoose = require('mongoose')

export const getAllBooks = async (category, pageSize, sort, currPage, easyState) => {
  const Book = mongoose.model('Book')
  let sort_query = {}
  let tag_query = {}
  let page_size = Number(pageSize) || 20
  let curr_page = Number(currPage) || 1
  let easy_state = Number(easyState) ? 1 : 0
  let filter = easy_state ? {'title': 1, 'img_url': 1, 'author': 1, 'translator': 1} : {}

  if(category) {
    tag_query.category = {
      $in: [category]
    }
  }

  if(sort) {
    if(sort === 'recommend'){
      sort_query = {
        'recommend_num': -1
      }
    } else if(sort === 'collection'){
      sort_query = {
        'collection_num': -1
      }
    } else if(sort === 'read'){
      sort_query = {
        'read_num': -1
      }
    } else if(sort === 'sale'){
      sort_query = {
        'sale_num': -1
      }
    }
  }


  const books = await Book.find(tag_query, filter).sort(sort_query).skip((curr_page - 1) * page_size).limit(page_size)
  
  return books
}

export const getBooksCount = async () => {
  const Book = mongoose.model('Book')
  const books = await Book.find({})
  const count = books.length

  return count
}

export const getBookDetail = async (id) => {
  const Book = mongoose.model('Book')
  const book = await Book.findOne({_id: id})

  return book
}

export const getRelativeBooks = async (book) => {
  const Book = mongoose.model('Book')

  const books = await Book.find({
    category: {
      $in: [book.category[0]]
    }
  })

  return books
}

export const tagNameToGetBooks = async (tagName) => {
  const Book = mongoose.model('Book')
}

export const updateBook = async (bookId, data) => {
  const Book = mongoose.model('Book')

  let code = await Book.update({ _id: bookId }, { $set: data });

  return code
}

export const removeBook = async (bookId) => {
  const Book = mongoose.model('Book')

  let code = await Book.remove({ _id: bookId });

  return code
}