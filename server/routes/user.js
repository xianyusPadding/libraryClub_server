const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router({
  prefix: '/api/v0/user'
})
const { checkPassword, register, loginState, userAction, userActionMess, userArticleAction, userArticleMess, userDetail } = require('../service/user')

router.post('/login', async (ctx, next) => {
  const { phone, password } = ctx.request.body
  
  const matchData = await checkPassword(phone, password)

  if(!matchData.user){
    return (ctx.body = {
      code: -1,
      message: '用户不存在'
    })
  }

  if(matchData.match) {
    return (ctx.body = {
      code: 0,
      message: '登陆成功',
      phone: matchData.user.phone,
      password: matchData.user.password
    })
  }

  return (ctx.body = {
    code: -1,
    message: '密码不正确'
  })
})

router.post('/register', async (ctx, next) => {
  const { userName, phone, password } = ctx.request.body
  
  const data = await register(userName, phone, password)

  return ctx.body = data
})

router.get('/loginState', async (ctx, next) => {
  const { phone, password } = ctx.query
  
  const login_state = await loginState(phone, password)

  return ctx.body = {
    loginState: login_state
  }
})

router.get('/actions', async (ctx, next) => {
  const { action, phone, bookId } = ctx.query
  
  const data = await userAction(action, phone, bookId)

  return ctx.body = data
})

router.get('/actionState', async (ctx, next) => {
  const { phone, bookId } = ctx.query
  
  const data = await userActionMess( phone, bookId )

  return ctx.body = data
})

router.get('/article/actions', async (ctx, next) => {
  const { action, phone, articleId } = ctx.query
  
  const data = await userArticleAction(action, phone, articleId)

  return ctx.body = data
})

router.get('/article/actionState', async (ctx, next) => {
  const { phone, articleId } = ctx.query
  
  const data = await userArticleMess( phone, articleId )

  return ctx.body = data
})

router.get('/detail', async (ctx, next) => {
  const { phone } = ctx.query
  const data = await userDetail(phone)

  return ctx.body = data
})

module.exports = router