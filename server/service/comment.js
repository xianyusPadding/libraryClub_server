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