const mongoose = require('mongoose')

export const checkPassword = async (phone, password) => {
  const User = mongoose.model('User')
  let match = false
  let user = await User.findOne({ phone: phone })

 if(user) {
    match = await user.comparePassword(password, user.password)
  }else{
    user = ''
    match = false
  }

  return {
    match: match,
    user: user
  }
}

export const register = async (userName, phone, password) => {
  const User = mongoose.model('User')
  const userNameMatch = await User.find({
    userName: userName
  })
  const phoneMatch = await User.find({
    phone: phone
  })

  let message = '注册成功'
  let code = 0

  if(userNameMatch.length > 0){
    message = '昵称已存在'
    code = -1
  }else if(phoneMatch.length > 0){
    message = '手机号码已注册'
    code = -1
  }else{
    User.create({
      userName: userName,
      phone: phone,
      password: password
    })
  }

  return {
    code,
    message
  }
}

export const loginState = async(phone, password) => {
  const User = mongoose.model('User')
  const user = await User.find({
    phone: phone,
    password :password
  })

  if(user.length > 0){
    return 1
  }else{
    return 0
  }
}

export const userAction = async (action, phone, bookId) => {
  const User = mongoose.model('User')
  const Book = mongoose.model('Book')
  const user = await User.findOne({
    phone: phone
  })
  const book = await Book.findOne({
    _id: bookId
  })
  
  if(user){
    switch (action) {
      case 'recommend': 
        if(user.recommendBooks.indexOf(bookId) > -1){
          await User.update({
            phone: phone
          },{
            $push: {
              recommendBooks: bookId
            }
          });
        }
        await Book.update({
          _id: bookId
        }, {
          recommend_num: book.recommend_num + 1
        })

        return {
          code: 0
        }
        break;
      case 'collect': 
        if(user.collectedBooks.indexOf(bookId) > -1){
          await User.update({
            phone: phone
          },{
            $push: {
              collectedBooks: bookId
            }
          });
        }
        await Book.update({
          _id: bookId
        }, {
          collection_num: book.collection_num + 1
        });
        return {
          code: 0
        }
        break;
      case 'read': 
        if(user.readBooks.indexOf(bookId) > -1){
          await User.update({
            phone: phone
          },{
            $push: {
              readBooks: bookId
            }
          });
        }
        await Book.update({
          _id: bookId
        }, {
          read_num: book.read_num + 1
        });

        return {
          code: 0
        }
        break;
      default: break;
    }
  }else{
    return {
      code: -1
    }
  }
}

export const userActionMess = async (phone, bookId) => {
  const User = mongoose.model('User')
  const Book = mongoose.model('Book')

  const user = await User.findOne({ phone: phone })
  
  let recomend_state = user.recommendBooks.indexOf(bookId) > -1 ? 1 : 0
  let collect_state = user.collectedBooks.indexOf(bookId) > -1 ? 1 : 0
  let buy_state = user.buyBooks.indexOf(bookId) > -1 ? 1 : 0

  return {
    recomend_state: recomend_state,
    collect_state: collect_state,
    buy_state: buy_state    
  }
}
