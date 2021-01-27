const express = require('express')
const News = require('./models/news2')
const newsRouter = require('./routers/news')
const reportsRouter = require('./routers/reporters')
const jwt = require('jsonwebtoken')

require('./db/mongoose')

const app = express()
const port = 3000
const multer = require('multer')
const uploads = multer({dest:'images',limits:{
    fileSize: 1000000
}, fileFilter(req, file, cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
        return cb (new Error('Please upload an image'))
    }
    
    cb(undefined, true)
}
})


app.use(express.json())
app.use(newsRouter)
app.use(reportsRouter)

app.listen(port, ()=>console.log('Server is running'))