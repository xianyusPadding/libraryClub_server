const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Mixed } = Schema.Types

const bookScheme = new Schema({
  book_id: {
    unique: true,
    type: String
  },
  title: String,
  img_url: String,
  author: String,
  translator: String,
  category: [String],
  tags: [{
    type: ObjectId,
    ref: 'Tag'
  }],
  summary: String,
  price: String,
  e_price: String,
  recommend_num: Number,
  collection_num: Number,
  read_num: Number,
  sale_num: Number,
  intro: String,
  catalog: [],
  publication_date: String,
  book_num: String,
  publication_state: String,
  original_title: String,
  features: String,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

//在bookSchema保存前的操作
bookScheme.pre('save', function(next) {
  if(this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})


mongoose.model('Book', bookScheme)