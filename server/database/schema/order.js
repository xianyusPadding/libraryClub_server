const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Mixed } = Schema.Types

const orderScheme = new Schema({
  books: [{
    _id: ObjectId,
    title: String,
    num: Number,
  }],
  totalPrice: String,
  address: String,
  user: [{
    type: ObjectId,
    ref: 'User'
  }],
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

//在orderScheme保存前的操作
orderScheme.pre('save', function(next) {
  if(this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})


mongoose.model('Order', orderScheme)