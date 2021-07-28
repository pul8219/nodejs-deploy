// const express = require('express')
import express from 'express'
const port = 3000
// const router = require('./api')

// const cors = require('cors');
// const cors_origin = 'http://localhost:5500'; // 허락하고자하는 주소
// app.use(
//   cors({
    //     origin: cors_origin,
//     credentials: true,
//   })
// );

// const path = require('path')
import path from 'path'
const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html')



app.use(express.static(DIST_DIR))

app.use(express.json()) // body-parser 대신 사용
// app.use(express.static('public')) // 정적 파일 서비스해주기

// app.get('/', (req, res) => {
//   res.render('index') // index.html render
// })

app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
})


const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
  })



// // 에러처리 미들웨어 함수
// const errorHandler = (err, req, res, next) => {
//   // res.locals.message = err.message;
//   // res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // // render the error page
//   // res.status(err.status || 500);
//   // res.send('error');

//   // res.render('error', {error: err})
//   res.status(500).json({
//     message: err.message,
//     error: err
//   })
// }


// // 미들웨어
// // app.use((req, res, next) => {
// //   const err = new Error('Error!')
// //   err.status = 404
// //   next(err)
// // })

// app.use('/api', router)

// // app.get('/api', (req, res) => {

// // })

// // 에러처리 미들웨어(가장 마지막에 선언해줄 것)
// app.use(errorHandler)

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
//   })

