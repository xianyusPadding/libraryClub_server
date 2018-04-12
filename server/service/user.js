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
      password: password,
      introduction: '',
      avater: ''
    }, function (err, jellybean, snickers) {
      if (err) {
        console.log(err)
      }
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
        if(user.recommendBooks.indexOf(bookId) === -1){
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
        if(user.collectedBooks.indexOf(bookId) === -1){
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
        if(user.readBooks.indexOf(bookId) === -1){
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

export const userArticleAction = async (action, phone, articleId) => {
  const User = mongoose.model('User')
  const Article = mongoose.model('Article')
  const user = await User.findOne({
    phone: phone
  })
  const article = await Article.findOne({
    _id: articleId
  })
  
  if(user){
    switch (action) {
      case 'recommend': 
        if(user.recommendArticles.indexOf(articleId) === -1){
          await User.update({
            phone: phone
          },{
            $push: {
              recommendArticles: articleId
            }
          });
        }
        await Article.update({
          _id: articleId
        }, {
          recommend_num: article.recommend_num + 1
        })

        return {
          code: 0
        }
        break;
      case 'collect': 
        if(user.collectedArticles.indexOf(articleId) === -1){
          await User.update({
            phone: phone
          },{
            $push: {
              collectedArticles: articleId
            }
          });
        }
        await Article.update({
          _id: articleId
        }, {
          collection_num: article.collection_num + 1
        });
        return {
          code: 0
        }
        break;
      case 'read': 
        if(user.readArticles.indexOf(articleId) === -1){
          await User.update({
            phone: phone
          },{
            $push: {
              readArticles: articleId
            }
          });
        }
        await Article.update({
          _id: articleId
        }, {
          read_num: article.read_num + 1
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

export const userArticleMess = async (phone, articleId) => {
  const User = mongoose.model('User')
  const Article = mongoose.model('Article')

  const user = await User.findOne({ phone: phone })
  
  let recomend_state = user.recommendArticles.indexOf(articleId) > -1 ? 1 : 0
  let collect_state = user.collectedArticles.indexOf(articleId) > -1 ? 1 : 0

  return {
    recomend_state: recomend_state,
    collect_state: collect_state   
  }
}

export const userDetail = async (phone) => {
  const User = mongoose.model('User')
  const user = await User.findOne({ phone: phone }, {userName: 1, avater: 1, introduction: 1, 'meta.createdAt': 1})

  let book_data = await User.findOne({ phone: phone }).populate({ path: 'buyBooks readBooks', select: { title: 1, img_url: 1, author: 1, translator: 1, _id: 1}})

  let article_data = await User.findOne({ phone: phone }).populate({ path: 'readArticles', select: { title: 1, author: 1, writeTime: 1, _id: 1}})

  let {buyBooks = [], readBooks = []} = book_data

  let readArticles = article_data.readArticles

  return {
    user: user,
    buyBooks: buyBooks,
    readBooks: readBooks,
    readArticles: readArticles
  }
}

function formatDate(Date){
  if(Date){
    let year = Date.split('-')[0]
    let month = Date.split('-')[1]
    let day = Date.split('-')[2]

    if(month < 10){
      month = '0' + String(month)
    }
    if(day < 10){
      day = '0' + String(day)
    }

    return `${year}-${month}-${day}`
  }
}

export const submitArticle = async (userId, title, content, summary) => {
  const User = mongoose.model('User')
  const Article = mongoose.model('Article')

  const user = await User.findOne({ _id: userId })
  const d = new Date()

  Article.create({
    title: title,
    type_id: 2,
    author: user.userName,
    avater: user.avater,
    writeTime: formatDate(`${d.getFullYear()}-${d.getMonth()}-${d.getDay()}`),
    content: content,
    summary: summary,
    user: userId
  })
  
  return {
    code: 0
  }
  
}
