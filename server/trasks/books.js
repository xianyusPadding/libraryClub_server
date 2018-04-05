const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Book = mongoose.model('Book')

;(async () => {
  const script = resolve(__dirname, '../crawler/book-list')
  console.log(script)
  const child = cp.fork(script, [])
  let invoked = false

  child.on('error', err => {
    if(invoked) return

    invoked = true
  })

  child.on('exit', code => {
    if(invoked) return

    invoked = true

    let err = code === 0 ? null : new Error('exit code ' + code)
    
    console.log(err)
  })

  child.on('message', data => {
    let result = data
    // console.log(result)

    result.forEach(async item => {
      let book = await Book.findOne({
        book_id: item.book_id
      })

      if(!book) {
        book = new Book(item)
        await book.save()
      }
    })
  })
})()