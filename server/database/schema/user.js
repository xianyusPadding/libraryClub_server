const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema
const { Mixed, ObjectId } = Schema.Types
const SALT_WORK_FACTOR = 10

const userSchema = new Schema({
  userName: {
    unique: true,
    type: String
  },
  phone: {
    unique: true,
    type: String
  },
  avater: String,
  password: String,
  introduction: String,
  power: Number,
  buyBooks: [{
    type: ObjectId,
    ref: 'Book'
  }],                 
  recommendBooks: [{
    type: ObjectId,
    ref: 'Book'
  }],
  collectedBooks: [{
    type: ObjectId,
    ref: 'Book'
  }],
  readBooks: [{
    type: ObjectId,
    ref: 'Book'
  }],
  orders: [{
    type: ObjectId,
    ref: 'Order'
  }],
  articles: [{
    type: ObjectId,
    ref: 'Article'
  }],
  recommendArticles: [{
    type: ObjectId,
    ref: 'Article'
  }],
  collectedArticles: [{
    type: ObjectId,
    ref: 'Article'
  }],
  readArticles: [{
    type: ObjectId,
    ref: 'Article'
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

userSchema.pre('save', function(next) {
  if(this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
    this.power = 1
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

userSchema.pre('save', function(next) {
  let user = this
  //isModified判断password字段是否发生改变
  console.log(user.isModified('password'))
  if(!user.isModified('password')) return next()
  //bcrypt加密库  SALT_WORK_FACTOR越大加密越强
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error)
      user.password = hash
      next()
    })
  })
})

userSchema.methods = {
  //比较密码
  comparePassword: function (_password, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, function (err, isMatch) {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  }
}

mongoose.model('User', userSchema)