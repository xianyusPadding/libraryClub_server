const puppeteer = require('puppeteer')
const url = "http://www.ituring.com.cn/book/"
const mongoose = require('mongoose')
const Book = mongoose.model('Book')

; (async () => {
  
  let books = await Book.find({
    // $or: [
    //   { publication_date: {$exists: false} },
    //   { publication_date: '' }
    // ]
  })

  const browser = await puppeteer.launch({   //创建一个浏览器
    args: ['-no-sandbox']    //启动一个非杀伤模式
  })

  const page = await browser.newPage() 
  
  console.log('总共要抓取' + books.length + '个数据')

  for(let i=1; i<books.length; i++){
    let book = books[i]
    let book_id = books[i].book_id
    let book_item_data = {}

    console.log('现在抓取的是第' + i + '个图书数据')
    let book_url = url + book_id

    await page.goto(book_url, {
      waitUntil: 'networkidle2' //在网络空闲的时候进行
    })
    
    book_item_data = await page.evaluate(() => {
      let $ = window.$
      let result = {}
      
      // result.category = []
      // $('.tags .post-tag').each((index, el) => {
      //   result.category[index] = $(el).text()
      // })

      // result.summary = $('.book-head-upper .readmore').text()
      // result.price = $('.price').eq(0).text()
      // result.e_price = $('.price').eq(1).text()
      // result.recommend_num = 0
      // result.collection_num = 0
      // result.read_num = 0
      // result.sale_num = 0
      // result.intro = $('.intro').html()
      // result.catalog = []
      // $('.table-striped tr').each((index, el) => {
      //   result.catalog[index] = {
      //     catalog_id: $(el).find('td a').attr('href') ?  $(el).find('td a').attr('href').split('tupubarticle/')[1] : '',
      //     content: $(el).find('td').eq(0).text()
      //   }
      // })

      
      result.features = $('.col-md-9 .intro').eq(0).text()

      $('.publish-info li').each((index, el) => {
        let type = $(el).text().substr(0, 4)
        let val = $(el).text().substr(4)
        switch(type){
          case '出版日期': result.publication_date = val;break;
          case '书　　号': result.book_num = val;break;
          case '出版状态': result.publication_state = val;break;
          case '原书名  ': result.original_title = val;break;
          default: break;
        }
      })
      return result
    })

    // book.category = book_item_data.category
    // book.summary = book_item_data.summary
    // book.price = book_item_data.price
    // book.e_price = book_item_data.e_price
    // book.recommend_num = book_item_data.recommend_num
    // book.collection_num = book_item_data.collection_num
    // book.read_num = book_item_data.read_num
    // book.sale_num = book_item_data.sale_num
    // book.intro = book_item_data.intro
    // book.catalog = book_item_data.catalog
    book.publication_date = book_item_data.publication_date
    book.features = book_item_data.features
    book.book_num = book_item_data.book_num
    book.publication_state = book_item_data.publication_state
    book.original_title = book_item_data.original_title

     
    await book.save()
  }
})()