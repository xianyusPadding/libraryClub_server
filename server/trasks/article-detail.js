const puppeteer = require('puppeteer')
const url = "http://www.ituring.com.cn/article/"
const mongoose = require('mongoose')
const Article = mongoose.model('Article')

; (async () => {
  
  let articles = await Article.find({
  })

  const browser = await puppeteer.launch({   //创建一个浏览器
    args: ['-no-sandbox']    //启动一个非杀伤模式
  })

  const page = await browser.newPage() 
  
  console.log('总共要抓取' + articles.length + '个数据')

  for(let i=1; i<articles.length; i++){
    let article = articles[i]
    let article_id = articles[i].article_id
    let article_item_data = {}

    console.log('现在抓取的是第' + i + '个图书数据')
    let article_url = url + article_id

    await page.goto(article_url, {
      waitUntil: 'networkidle2'
    })
    
    article_item_data = await page.evaluate(() => {
      let $ = window.$
      let result = {}
      
      result.content = $('.markdown-body').html()
      return result
    })

    article.content = article_item_data.content
    article.recommend_num = 0
    article.collection_num = 0
    article.read_num = 0
    article.type_id = 1

     
    await article.save()
  }
})()