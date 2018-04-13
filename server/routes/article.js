const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router({
  prefix: '/api/v0/articles'
})
const { getAllArticle, getArticlesCount, getArticleDetail, removeArticle, updateArticle } = require('../service/article')

router.get('/all', async (ctx, next) => {
  const { pageSize, sort, currPage, easyState, typeId, userId } = ctx.query
  const articles = await getAllArticle(pageSize, sort, currPage, easyState, typeId, userId)
  const count = await getArticlesCount(typeId, userId)

  ctx.body = {
    articles,
    count: count
  }
})

router.get('/detail/:id', async (ctx, next) => {
  const id = ctx.params.id
  const article = await getArticleDetail(id)
  
  ctx.body = {
    article
  }
})

router.post('/update', async (ctx, next) => {
  const { articleId, content } = ctx.request.body

  const data = await updateArticle(articleId, content)
  
  ctx.body = data
})

router.post('/remove', async (ctx, next) => {
  const { articleId } = ctx.request.body

  const data = await removeArticle(articleId)
  
  ctx.body = data
})

module.exports = router