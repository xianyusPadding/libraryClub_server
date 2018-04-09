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
  password: String,
  buyBooks: [{
    type: ObjectId,
    default: 'Book'
  }],                 
  recommendBooks: [{
    type: ObjectId,
    default: 'Book'
  }],
  collectedBooks: [{
    type: ObjectId,
    default: 'Book'
  }],
  readBooks: [{
    type: ObjectId,
    default: 'Book'
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
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

userSchema.pre('save', function(next) {
  let user = this
  //isModified判断字段是否发生改变
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