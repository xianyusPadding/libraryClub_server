const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router({
  prefix: '/api/v0/user'
})
const { checkPassword, register, loginState, userAction, userActionMess, userArticleAction, userArticleMess, userDetail, submitArticle, allUser } = require('../service/user')

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
      password: matchData.user.password,
      _id: matchData.user._id
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

router.get('/all', async (ctx, next) => {
  const {pageSize, currPage} = ctx.query
  const data = await allUser(pageSize, currPage)

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

router.post('/article', async (ctx, next) => {
  const { userId, title, content, summary } = ctx.request.body
  const data = await submitArticle(userId, title, content, summary)

  return ctx.body = data
})

router.post('/power', async (ctx, next) => {
  const { userId, power } = ctx.request.body
  // const data = await submitArticle(userId)
  const User = mongoose.model('User')
  let data = await User.update({
    _id: userId
  }, {
    power: power
  })

  return ctx.body = data
})

router.get('/getPowerState', async (ctx, next) => {
  const { userId } = ctx.query
  const User = mongoose.model('User')
  let user = await User.findOne({
    _id: userId
  })

  return ctx.body = {
    power: user.power
  }
})

router.post('/remove', async (ctx, next) => {
  const { userId } = ctx.request.body
  const User = mongoose.model('User')

  let code = await User.remove({ _id: userId });

  return ctx.body = code
})

module.exports = router