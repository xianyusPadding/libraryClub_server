const mongoose = require('mongoose')

export const getAllArticle = async (pageSize, sort, currPage, easyState, typeId, userId, search_content) => {
  const Article = mongoose.model('Article')

  let tag_query = {}
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

  user_id ? tag_query.user = user_id : ''
   
  if(search_content){
    let searchReg = new RegExp(search_content)
    tag_query.title = searchReg
  }

  tag_query.type_id = type_id
  

  const articles = await Article.find(tag_query, filter).sort(sort_query).skip((curr_page - 1) * page_size).limit(page_size)
  const allArticles = await Article.find(tag_query, filter).sort(sort_query)
  
  return {
    articles: articles,
    count: allArticles.length
  }
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

export const removeArticle = async (articleId) => {
  const Article = mongoose.model('Article')

  let code = await Article.remove({ _id: articleId });

  return code
}

export const updateArticle = async (articleId, data) => {
  const Article = mongoose.model('Article')

  let code = await Article.update({ _id: articleId }, { $set: data });

  return code
}