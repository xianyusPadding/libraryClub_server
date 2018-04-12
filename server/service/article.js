const mongoose = require('mongoose')

export const getAllArticle = async (pageSize, sort, currPage, easyState, typeId, userId) => {
  const Article = mongoose.model('Article')
  let sort_query = {}
  let page_size = Number(pageSize) || 10
  let curr_page = Number(currPage) || 1
  let easy_state = Number(easyState) ? 1 : 0
  let type_id = typeId || 1
  let user_id = userId || ''
  let filter = easy_state ? {'title': 1, 'avater': 1, 'author': 1, 'summary': 1, 'writeTime': 1} : {}

  if(sort) {
    if(sort === 'recommend'){
      sort_query = {
        'recomend_num': -1
      }
    } else if(sort === 'collect'){
      sort_query = {
        'collect_num': -1
      }
    } else if(sort === 'read'){
      sort_query = {
        'read_num': -1
      }
    }
  }else{
    sort_query = {
      'meta.createdAt': -1
    }
  }

  let articles = []

  if(user_id){
    articles = await Article.find({ user: user_id }, filter).sort(sort_query).skip((curr_page - 1) * page_size).limit(page_size)
  }else {
    articles = await Article.find({ type_id: type_id }, filter).sort(sort_query).skip((curr_page - 1) * page_size).limit(page_size)
  }
  
  return articles
}

export const getArticlesCount = async (typeId, userId) => {
  let type_id = typeId || 1
  let user_id = userId || ''
  const Article = mongoose.model('Article')

  let articles = []
  
  if(user_id){
    articles = await Article.find({ user: user_id })
  }else{
    articles = await Article.find({ type_id: type_id })
  }
  const count = articles.length

  return count
}

export const getArticleDetail = async (id) => {
  const Article = mongoose.model('Article')
  const article = await Article.findOne({_id: id})

  return article
}