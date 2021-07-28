const express = require('express')
const router = require('./api')
const PORT = process.env.PORT || 8080
const path = require('path')
// import path from 'path'

const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html')

app.use(express.static(DIST_DIR))

app.use(express.json()) // body-parser 대신 사용

app.get('/', (req, res) => {
    res.render(HTML_FILE) // index.html render
})


// 에러처리 미들웨어 함수
const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    error: err
  })
}

app.use('/api', router)

// 에러처리 미들웨어(가장 마지막에 선언해줄 것)
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
  })
