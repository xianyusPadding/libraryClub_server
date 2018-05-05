const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Mixed } = Schema.Types

const articleScheme = new Schema({
  title: String,
  article_id: String,
  img_url: String,
  author: String,
  avater: String,
  writeTime: String,
  content: String,
  summary: String,
  recommend_num: Number,
  collection_num: Number,
  read_num: Number,
  type_id: Number,
  user_id: ObjectId,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  },
  user: {                          //文章作者的id
    type: ObjectId,
    ref: 'User'
  }
})

//在articleScheme保存前的操作
articleScheme.pre('save', function(next) {
  if(this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
    this.recommend_num = 0
    this.collection_num = 0
    this.read_num = 0
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})


mongoose.model('Article', articleScheme)