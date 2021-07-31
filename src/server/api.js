const express = require('express')
const router = express.Router()
const fs = require('fs')
const { v1: uuidv1 } = require('uuid') // 고유 id를 생성해주는 uuid 사용
const {body, validationResult} = require('express-validator')
const path = require('path')

// const db_path = '../src/data.json'
// const fullpath = path.resolve(__dirname, db_path)

const db_path = '../src/data.json'
const fullpath = path.resolve(__dirname, db_path)

const readFile = (path) => {
    return JSON.parse(fs.readFileSync(path, 'utf-8'))
}

const writeFile = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data));
    return
}


/**
 * 아이템 조회
 */
router.get('/items', (req, res, next) => {
    try{
        const data = readFile(fullpath)
        res.status(200).json({items: data.items, selectedItem: data.selectedItem})
    }
    catch(err){
        next(err)
    }
    
})


// 현재 body에 content에 대한 내용을 넣지 않아도 에러 없이 처리됨(수정 필요 - 특정 에러핸들러를 만들어야되나?) express-validator로 해결 완료
/**
 * 아이템 추가
 */
router.post('/items', 
        body('content').trim().isLength({min:1, max:50}),
        (req, res, next) => {
            try{
                const errors = validationResult(req)
                if(!errors.isEmpty()){
                    return res.status(400).json({errors: errors.array()})
                }

                // throw new Error('broken')
                const data = readFile(fullpath)
                data.items.push({
                    id: uuidv1(),
                    content: req.body.content,
                    completed: false,
                    createdAt: Date.now()
                })
                writeFile(fullpath, data);
                return res.json({message: 'success'})
            }
            catch(err){
                next(err)
            }
            
})


/**
 * 아이템 수정 모드 바꾸기(selectedItem값 변화시)
 */
 router.put('/items', (req, res, next) => {
     try{
        const data = readFile(fullpath);
            // 해제시 itemId: -1, 수정모드시 itemId: 선택된 아이템의 id
            data.selectedItem = req.body.selectedItem
            writeFile(fullpath, data)
            return res.json({message: 'success'})
     }
     catch(err){
         next(err)
     }
    
})


/**
 * 아이템 수정
 */
 router.put('/items/:itemId', 
    body('content').trim().isLength({min:1, max:50}),
    (req, res, next) => {
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array()})
            }

            const data = readFile(fullpath);            
            const foundIndex = data.items.findIndex(element => element.id === req.params.itemId)
            const newContent = {
                content: req.body.content
            };
            data.items[foundIndex] = {...data.items[foundIndex], ...newContent}
            data.selectedItem = -1
            writeFile(fullpath, data)
            return res.json({message: 'success'})
        }
        catch(err){
            next(err)
        }

})


/**
 * 아이템 토글
 */
 router.put('/items/toggle/:itemId',
    (req, res, next) => {
        try{
            const data = readFile(fullpath)
            const foundIndex = data.items.findIndex(element => element.id === req.params.itemId)
            const newContent = {
                completed: !data.items[foundIndex].completed
            }
            data.items[foundIndex] = {...data.items[foundIndex], ...newContent}
            writeFile(fullpath, data)
            return res.json({message: 'success'})
        }
        catch(err){
            next(err)
        }

})


/**
 * 아이템 삭제
 */
 router.delete('/items/:itemId',
    (req, res, next) => {
        try{
            const data = readFile(fullpath)
            const foundIndex = data.items.findIndex(element => element.id === req.params.itemId)
            data.items.splice(foundIndex, 1)
            writeFile(fullpath, data)
            return res.json({message: 'success'})
        }
        catch(err){
            next(err)
        }

    })


module.exports = router
