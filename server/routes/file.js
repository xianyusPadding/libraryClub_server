const Router = require('koa-router')
const fs = require('fs');
const send = require('koa-send');
const router = new Router({
  prefix: '/api/v0/file'
})

router.post('/upload', async (ctx, next) => {
  const file = ctx.request.body.files.file
  const reader = fs.createReadStream(file.path)
  const ext = file.name.split('.').pop()
  let fileName = Math.random().toString().split('0.')[1] + `.${ext}`
  const upStream = fs.createWriteStream(`server/static/images/${fileName}`)

  reader.pipe(upStream)

  return ctx.body = {
    ok: 0,
    message: '上传成功！',
    fileName: fileName
  }
})

router.post('/download/:name', async (ctx, next) => {
  const name = ctx.params.name;
  const path = `server/static/images/${name}`;
  ctx.attachment(path);
  await send(ctx, path);
})

module.exports = router