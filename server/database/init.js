const mongoose = require('mongoose')
// const { resolve } = require('path')
const db = 'mongodb://localhost/library-test'

mongoose.Promise = global.Promise

exports.connect = () => {
  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    if(process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
   
    mongoose.connect(db)
  
    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++

      if(maxConnectTimes < 5){
        mongoose.connect(db)
      }else{
        throw new Error('数据库挂了')
      }
      
    })
  
    mongoose.connection.on('error', err => {
      maxConnectTimes++
      
      if(maxConnectTimes < 5){
        mongoose.connect(db)
      }else{
        throw new Error('数据库挂了')
      }
    })
  
    mongoose.connection.on('open', err => {
      const dog = mongoose.model('Dog', { name: String })
      const doga = new dog({ name: 'aaa' })

      doga.save().then(() => {
        console.log('wang')
      })

      resolve()
      console.log('MongoDB connected successfully!')
    })
  })
}