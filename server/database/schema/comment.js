const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { Mixed, ObjectId } = Schema.Types

const commentSchema = new Schema({
  pid: Mixed,
  type: Number,
  aid: ObjectId,
  content: String,
  user: {
    name: String,
    avater: String,
    uid: {
      type: ObjectId,
      ref: 'User'
    },
  },
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

commentSchema.pre('save', function(next) {
  if(this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

// userSchema.methods = {
//   //比较密码
//   comparePassword: function (_password, password) {
//     return new Promise((resolve, reject) => {
//       bcrypt.compare(_password, password, function (err, isMatch) {
//         if (!err) resolve(isMatch)
//         else reject(err)
//       })
//     })
//   }
// }

mongoose.model('Comment', commentSchema)