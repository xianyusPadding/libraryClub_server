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
      phone: phone,
      userName: user.userName,
      totalPrice: totalPrice
    }).then((new_reply) => {
      let orderId = new_reply._id

      if(user.orders.indexOf(orderId) === -1){
        user.save({
          orders: user.orders.push(orderId)
        })
      }
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
    
    if(user.buyBooks.indexOf(val._id) === -1){
      user.save({
        buyBooks: user.buyBooks.push(val._id)
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

export const getAllOrder = async (pageSize, currPage, search_content) => {
  const Order = mongoose.model('Order')
  const User = mongoose.model('User')

  let tag_query = {}
  let sort_query = {}
  let page_size = Number(pageSize) || 10
  let curr_page = Number(currPage) || 1

  sort_query = {
    'meta.createdAt': -1
  }

   
  if(search_content){
    let searchReg = new RegExp(search_content)
    tag_query.title = searchReg
  }

  const orders = await Order.find(tag_query).sort(sort_query).skip((curr_page - 1) * page_size).limit(page_size)

  const allOrders = await Order.find(tag_query).sort(sort_query)
  
  return {
    orders: orders,
    count: allOrders.length
  }
}

export const removeOrder = async (orderId) => {
  const Order = mongoose.model('Order')

  let code = await Order.remove({ _id: orderId });

  return code
}

export const sendOrOk = async (orderId, state) => {
  const Order = mongoose.model('Order')

  let code = await Order.update({ _id: orderId }, {
    $set: {state: state}
  });

  return code
}