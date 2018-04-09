const puppeteer = require('puppeteer')
const url = "http://www.ituring.com.cn/article?tab=article&sort=new&page="
const mongoose = require('mongoose')
const Article = mongoose.model('Article')

; (async () => {
  const browser = await puppeteer.launch({   //创建一个浏览器
    args: ['-no-sandbox']    //启动一个非杀伤模式
  })

  const page = await browser.newPage() 

  for(let i=0; i<4; i++){
    console.log('现在抓取的是第' + i + '个页面')
    let article_url = url + i

    await page.goto(article_url, {
      waitUntil: 'networkidle2' //在网络空闲的时候进行
    })
    
    let articles_data = []
    articles_data = await page.evaluate(() => {
      let $ = window.$
      let result = []
      let data = $('.block-articles .block-item')

      data.each((index, el) => {
        result[index] = {
          title: $(el).find('.article-title').text(),
          article_id: $(el).find('.article-title a').attr('href') ? $(el).find('.article-title a').attr('href').split('/article/')[1] : '',
          author: $(el).find('.author').text(),
          avater: $(el).find('.article-avatar img').attr('src'),
          writeTime: $(el).find('.time').text() ? $(el).find('.time').text().split('发表于 ')[1] : '',
          summary: $(el).find('.article-summary p').text()     
        }
      })
      
      
      return result
    })

    articles_data.map(async (val) => {
      let article = await Article.findOne({
        article_id: val.article_id
      })

      if(!article) {
        article = new Article(val)
        await article.save()
      }
    })

     
    
  }
})()