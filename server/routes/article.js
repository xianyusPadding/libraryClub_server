const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router({
  prefix: '/api/v0/articles'
})
const { getAllArticle, getArticlesCount, getArticleDetail } = require('../service/article')

router.get('/all', async (ctx, next) => {
  const { pageSize, sort, currPage, easyState } = ctx.query
  const articles = await getAllArticle(pageSize, sort, currPage, easyState)
  const count = await getArticlesCount()

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

module.exports = router