const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router({
  prefix: '/api/v0/comment'
})
const { getAllComments, addComment } = require('../service/comment')

router.get('/allComments', async (ctx, next) => {
  const { type, aid, pid } = ctx.query
  
  const data = await getAllComments( type, aid, pid )

  ctx.body = data
})

router.post('/addComment', async (ctx, next) => {
  const { type, aid, pid, content, uid } = ctx.request.body
  
  const data = await addComment( type, aid, pid, content, uid )
  
  ctx.body = data
})

module.exports = router