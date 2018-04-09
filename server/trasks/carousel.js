const puppeteer = require('puppeteer')
const url = "https://www.epubit.com/"
const mongoose = require('mongoose')
const Carousel = mongoose.model('Carousel')

; (async () => {
  let carousels = []
  const browser = await puppeteer.launch({   //创建一个浏览器
    args: ['-no-sandbox']    //启动一个非杀伤模式
  })

  const page = await browser.newPage() 
  await page.goto(url, {
    waitUntil: 'networkidle2' //在网络空闲的时候进行
  })
  
  carousels = await page.evaluate(() => {
    let $ = window.$
    let result = {}

    for(let i=0; i<5; i++){
      result.title = $('.swiper-wrapper img').eq(i)[0].alt
      result.img_url = url + $('.swiper-wrapper img').eq(i)[0].attributes[0]
      // result
    }
    
    
    return result
  })
  
})()