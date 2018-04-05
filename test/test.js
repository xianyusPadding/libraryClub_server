class Boy {
  @speak('中文')
  shop(){
    console.log('shop')
  }
}

function speak (language) {
  return function (target, key, descriptor) {
    console.log(target)
    console.log(key)
    console.log(descriptor)
  }
}

const feilong = new Boy()

// feilong.shop()