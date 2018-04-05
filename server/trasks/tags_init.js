const mongoose = require('mongoose')
const Book = mongoose.model('Book')
const Tag = mongoose.model('Tag')

; (async () => {
  
  let books = await Book.find({})  

  for(let i=0; i<books.length; i++){
    let book = books[i]

    book.category.forEach( async (val, ind) => {
      let tag = await Tag.findOne({
        name: val
      })
      
      if(!tag){
        tag = new Tag({
          name: val,
          books: [book._id]
        })
      }else{
        if(tag.books.indexOf(book._id) === -1){
          tag.books.push(book._id)
        }
      }

      await tag.save()

      if(book.tags.indexOf(tag._id) === -1){
        book.tags.push(tag._id)
      }
      await book.save()
    })
  }

})()