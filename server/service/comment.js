const mongoose = require('mongoose')

export const getAllComments = async ( type, aid, pid ) => {
  const Comment = mongoose.model('Comment')
  const User = mongoose.model('User')
  let p_id = 0
  let sort_query = {}
  let page_size = 10

  if( pid != 0 ){
    p_id = pid
  }

  let comments = await Comment.find({
    type: type,
    aid: aid,
    pid: p_id
  }).sort({
    'meta.createdAt': -1
  }).limit(page_size)

  return {
    ok: 0,
    comments: comments
  }
}

// export const getAllComments = async ( type, aid, pid ) => {
//   const Comment = mongoose.model('Comment')
//   const User = mongoose.model('User')
//   let p_id = 0
//   let sort_query = {}
//   let page_size = 10

//   if( pid != 0 ){
//     p_id = pid
//   }

//   let _comments = []
//   let comments = await Comment.find({
//     type: type,
//     aid: aid,
//     pid: p_id
//   }).sort({
//     'meta.createdAt': -1
//   }).limit(page_size)

//   let count = 0
//   let total = comments.length

//   comments.map( async (val, ind) => {
//     user = await User.findOne({_id: val.uid})

//     if(user){
//       _comments[ind] = {}
//       _comments[ind]._id = val._id
//       _comments[ind].pid = val.pid
//       _comments[ind].meta = val.meta
//       _comments[ind].avater = user.avater
//       _comments[ind].userName = user.userName
//     }

//     if(count === total){
//       return {
//         ok: 0,
//         comments: _comments
//       }
//     }
//   })

//   return {
//     ok: 0,
//     comments: _comments
//   }
// }

export const addComment = async ( type, aid, pid, content, uid ) => {
  const Comment = mongoose.model('Comment')
  const User = mongoose.model('User')

  let user = await User.findOne({ _id: uid })

  if(!user){
    return {
      ok: -1
    }
  }
  
  let data = await Comment.create({
    type: type,
    aid: aid,
    pid: pid,
    content: content,
    'user.name': user.userName,
    'user.uid': user._id,
    'user.avater': user.avater,
  })

  return {
    ok: 0,
    data: data
  }
}