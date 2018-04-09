const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Mixed } = Schema.Types

const carouselScheme = new Schema({
  title: String,
  img_url: String,
  back_color: String,
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
carouselScheme.pre('save', function(next) {
  if(this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})


mongoose.model('Carousel', carouselScheme)