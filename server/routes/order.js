const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router({
  prefix: '/api/v0/order'
})
const { submitOrder, getAllOrder, removeOrder, sendOrOk } = require('../service/order')

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

router.get('/all', async (ctx, next) => {
  const { pageSize, currPage, search_content } = ctx.query
  const data = await getAllOrder(pageSize, currPage, search_content)

  ctx.body = data
})

router.post('/remove', async (ctx, next) => {
  const { orderId } = ctx.request.body

  const data = await removeOrder(orderId)
  
  ctx.body = data
})

router.post('/sendOrOk', async (ctx, next) => {
  const { orderId, state } = ctx.request.body

  const data = await sendOrOk(orderId, state)
  
  ctx.body = data
})


module.exports = router