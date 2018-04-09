const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router({
  prefix: '/api/v0/order'
})
const { submitOrder } = require('../service/order')

router.post('/submit', async (ctx, next) => {
  const { books, address, phone, totalPrice } = ctx.request.body
  const data = await submitOrder(books, address, phone, totalPrice)

  let code = data.code
  let message = data.message

  ctx.body = {
    code: code,
    message: message
  }
})


module.exports = router