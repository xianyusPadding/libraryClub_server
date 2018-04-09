const mongoose = require('mongoose')

export const submitOrder = async (books, address, phone, totalPrice) => {
  const Order = mongoose.model('Order')
  const User = mongoose.model('User')
  const Book = mongoose.model('Book')
  let user = await User.findOne({
    phone: phone
  })
  
  if(user){
    Order.create({
      books: books,
      address: address,
      userId: user._id,
      totalPrice: totalPrice
    })
  }else{
    return {
      code: -1,
      message: '用户不存在'
    }
  }
  

  books.forEach( async (val, index) => {
    let book = await Book.findOne({
      _id: val._id
    })
    
    if(user.buyBooks.indexOf(val._id) > -1){
      user.save({
        $push: {
          buyBooks: bookId
        }
      })
    }

    let sale_num = book.sale_num

    book.save({
      sale_num: sale_num
    })
  })

  return {
    code: 0,
    message: '购买成功'
  }
}