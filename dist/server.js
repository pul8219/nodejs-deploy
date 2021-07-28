/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/server/api.js":
/*!***************************!*\
  !*** ./src/server/api.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar express = __webpack_require__(/*! express */ \"express\");\n\nvar router = express.Router();\n\nvar fs = __webpack_require__(/*! fs */ \"fs\");\n\nvar _require = __webpack_require__(/*! uuid */ \"uuid\"),\n    uuidv1 = _require.v1; // 고유 id를 생성해주는 uuid 사용\n\n\nvar _require2 = __webpack_require__(/*! express-validator */ \"express-validator\"),\n    body = _require2.body,\n    validationResult = _require2.validationResult;\n\nvar path = __webpack_require__(/*! path */ \"path\");\n\nvar db_path = '../src/data.json';\nvar fullpath = path.resolve(__dirname, db_path);\n\nvar readFile = function readFile(path) {\n  return JSON.parse(fs.readFileSync(path, 'utf-8'));\n};\n\nvar writeFile = function writeFile(path, data) {\n  fs.writeFileSync(path, JSON.stringify(data));\n  return;\n};\n/**\r\n * 아이템 조회\r\n */\n\n\nrouter.get('/items', function (req, res, next) {\n  try {\n    var data = readFile(fullpath);\n    res.status(200).json({\n      items: data.items,\n      selectedItem: data.selectedItem\n    });\n  } catch (err) {\n    next(err);\n  }\n}); // 현재 body에 content에 대한 내용을 넣지 않아도 에러 없이 처리됨(수정 필요 - 특정 에러핸들러를 만들어야되나?) express-validator로 해결 완료\n\n/**\r\n * 아이템 추가\r\n */\n\nrouter.post('/items', body('content').trim().isLength({\n  min: 1,\n  max: 50\n}), function (req, res, next) {\n  try {\n    var errors = validationResult(req);\n\n    if (!errors.isEmpty()) {\n      return res.status(400).json({\n        errors: errors.array()\n      });\n    } // throw new Error('broken')\n\n\n    var data = readFile(fullpath);\n    data.items.push({\n      id: uuidv1(),\n      content: req.body.content,\n      completed: false,\n      createdAt: Date.now()\n    });\n    writeFile(fullpath, data);\n    return res.json({\n      message: 'success'\n    });\n  } catch (err) {\n    next(err);\n  }\n});\n/**\r\n * 아이템 수정 모드 바꾸기(selectedItem값 변화시)\r\n */\n\nrouter.put('/items', function (req, res, next) {\n  try {\n    var data = readFile(fullpath); // 해제시 itemId: -1, 수정모드시 itemId: 선택된 아이템의 id\n\n    data.selectedItem = req.body.selectedItem;\n    writeFile(fullpath, data);\n    return res.json({\n      message: 'success'\n    });\n  } catch (err) {\n    next(err);\n  }\n});\n/**\r\n * 아이템 수정\r\n */\n\nrouter.put('/items/:itemId', body('content').trim().isLength({\n  min: 1,\n  max: 50\n}), function (req, res, next) {\n  try {\n    var errors = validationResult(req);\n\n    if (!errors.isEmpty()) {\n      return res.status(400).json({\n        errors: errors.array()\n      });\n    }\n\n    var data = readFile(fullpath);\n    var foundIndex = data.items.findIndex(function (element) {\n      return element.id === req.params.itemId;\n    });\n    var newContent = {\n      content: req.body.content\n    };\n    data.items[foundIndex] = _objectSpread(_objectSpread({}, data.items[foundIndex]), newContent);\n    data.selectedItem = -1;\n    writeFile(fullpath, data);\n    return res.json({\n      message: 'success'\n    });\n  } catch (err) {\n    next(err);\n  }\n});\n/**\r\n * 아이템 토글\r\n */\n\nrouter.put('/items/toggle/:itemId', function (req, res, next) {\n  try {\n    var data = readFile(fullpath);\n    var foundIndex = data.items.findIndex(function (element) {\n      return element.id === req.params.itemId;\n    });\n    var newContent = {\n      completed: !data.items[foundIndex].completed\n    };\n    data.items[foundIndex] = _objectSpread(_objectSpread({}, data.items[foundIndex]), newContent);\n    writeFile(fullpath, data);\n    return res.json({\n      message: 'success'\n    });\n  } catch (err) {\n    next(err);\n  }\n});\n/**\r\n * 아이템 삭제\r\n */\n\nrouter[\"delete\"]('/items/:itemId', function (req, res, next) {\n  try {\n    var data = readFile(fullpath);\n    var foundIndex = data.items.findIndex(function (element) {\n      return element.id === req.params.itemId;\n    });\n    data.items.splice(foundIndex, 1);\n    writeFile(fullpath, data);\n    return res.json({\n      message: 'success'\n    });\n  } catch (err) {\n    next(err);\n  }\n});\nmodule.exports = router;\n\n//# sourceURL=webpack://nodejs-deploy/./src/server/api.js?");

/***/ }),

/***/ "./src/server/server-dev.js":
/*!**********************************!*\
  !*** ./src/server/server-dev.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("var express = __webpack_require__(/*! express */ \"express\");\n\nvar router = __webpack_require__(/*! ./api */ \"./src/server/api.js\");\n\nvar PORT = process.env.PORT || 8080;\n\nvar path = __webpack_require__(/*! path */ \"path\"); // import path from 'path'\n\n\nvar app = express(),\n    DIST_DIR = __dirname,\n    HTML_FILE = path.join(DIST_DIR, 'index.html');\napp.use(express[\"static\"](DIST_DIR));\napp.use(express.json()); // body-parser 대신 사용\n\napp.get('/', function (req, res) {\n  res.render(HTML_FILE); // index.html render\n}); // 에러처리 미들웨어 함수\n\nvar errorHandler = function errorHandler(err, req, res, next) {\n  res.status(500).json({\n    message: err.message,\n    error: err\n  });\n};\n\napp.use('/api', router); // 에러처리 미들웨어(가장 마지막에 선언해줄 것)\n\napp.use(errorHandler);\napp.listen(PORT, function () {\n  console.log(\"Example app listening at http://localhost:\".concat(PORT));\n});\n\n//# sourceURL=webpack://nodejs-deploy/./src/server/server-dev.js?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "express-validator":
/*!************************************!*\
  !*** external "express-validator" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("express-validator");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("uuid");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/server/server-dev.js");
/******/ 	
/******/ })()
;