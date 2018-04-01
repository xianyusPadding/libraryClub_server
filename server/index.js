const Koa = require('koa')
const { resolve } = require('path')
const { connect } = require('./database/init')

;(async () => {
  await connect()
})()