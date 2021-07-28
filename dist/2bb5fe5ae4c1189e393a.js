function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// import logMessage from './js/logger.js'
// import './css/style.css'
// // Log message to console
// logMessage('Welcome to Expack!')
var base_url = 'http://localhost:8080';
var $app = document.querySelector('#app');
var $itemList = document.querySelector('#app ul');
var $appenderForm = document.querySelector('form[name="appenderForm"]'); // http 요청을 보내는 util 함수

var sendHttpRequest = function sendHttpRequest(method, url, data) {
  return fetch(base_url + url, {
    method: method,
    body: JSON.stringify(data),
    headers: data ? {
      'Content-Type': 'application/json'
    } : {}
  }).then(function (response) {
    if (response.status >= 400) {
      return response.json().then(function (errResData) {
        var error = new Error('Something went wrong!');
        error.data = errResData;
        throw error;
      });
    } // console.log(response);


    return response.json();
  });
}; // 아이템 템플릿


var itemTemplate = function itemTemplate(items, selectedItem) {
  return "".concat(items.map(function (item) {
    if (item.id === selectedItem) {
      return "\n            <li>\n            <form name=\"modifierForm\" action=\"\">\n                <legend hidden>\uC544\uC774\uD15C \uC218\uC815</legend>\n                    <input type=\"text\" value=\"".concat(item.content, "\" size=\"40\" data-idx=\"").concat(item.id, "\">\n                <button type=\"submit\">\uC644\uB8CC</button>\n                <button type=\"button\" class=\"cancelEditBtn\">\uCDE8\uC18C</button>\n            </form>\n            </li>\n        ");
    }

    return "\n        <li>\n            <p ".concat(item.completed ? 'style="color:#09f;text-decoration-line:line-through"' : '', ">\n                <input class=\"complete\" type=\"checkbox\" ").concat(item.completed ? 'checked' : '', " data-idx=\"").concat(item.id, "\" />\n                ").concat(item.content, "\n            </p>\n            <button type=\"button\" class=\"modifier\" data-idx=\"").concat(item.id, "\">\uC218\uC815</button>\n            <button type=\"button\" class=\"deleter\" data-idx=\"").concat(item.id, "\">\uC0AD\uC81C</button>\n        </li>");
  }).join(''), "\n");
};

var setEvent = function setEvent() {
  addEvent('submit', 'form[name="appenderForm"]', addItem); // $appenderForm.addEventListener('submit', addItem);

  addEvent('click', '.modifier', editItem);
  addEvent('click', '.cancelEditBtn', cancelEdit);
};

var addEvent = function addEvent(eventType, selector, callback) {
  var children = _toConsumableArray($app.querySelectorAll(selector));

  var isTarget = function isTarget(target) {
    return children.includes(target) || target.closest(selector);
  };

  $app.addEventListener(eventType, function (event) {
    if (!isTarget(event.target)) return false;
    callback(event);
  });
}; // 아이템 render


var render = function render(data) {
  // console.log(data.selectedItem);
  $itemList.innerHTML = itemTemplate(data.items, data.selectedItem); // // 아이템 수정 버튼 관리
  // const $modifiers = $app.querySelectorAll('.modifier');
  // $modifiers.forEach(($modifier) => {
  //     $modifier.addEventListener('click', editItem);
  // });
  // 아이템 수정 관리

  var $modifierForm = document.querySelector('form[name="modifierForm"]');

  if ($modifierForm) {
    $modifierForm.addEventListener('submit', updateItem); // // 아이템 수정 취소 버튼 관리
    // const $cancelEditBtns = $app.querySelectorAll('.cancelEditBtn');
    // $cancelEditBtns.forEach(($cancelEditBtn) => {
    //     $cancelEditBtn.addEventListener('click', cancelEdit);
    // });
  }

  var $toggles = $app.querySelectorAll('.complete');
  $toggles.forEach(function ($toggle) {
    $toggle.addEventListener('click', toggleItem);
  });
  var $deleters = $app.querySelectorAll('.deleter');
  $deleters.forEach(function ($deleter) {
    $deleter.addEventListener('click', deleteItem);
  });
}; // 아이템 조회


var viewItem = function viewItem() {
  sendHttpRequest('GET', '/api/items').then(function (responseData) {
    render(responseData);
    $appenderForm.querySelector('input').value = '';
    $appenderForm.querySelector('input').focus();
  })["catch"](function (err) {
    console.error(err, err.data);
  });
}; // 아이템 추가


var addItem = function addItem(event) {
  event.preventDefault();
  var item = {
    content: event.target.querySelector('input').value
  };
  sendHttpRequest('POST', '/api/items', item).then(function (responseData) {
    console.log(responseData);
  })["catch"](function (err) {
    console.error(err, err.data);
  });
  viewItem(); // event.target.querySelector('input').value = '';
  // event.target.querySelector('input').focus();
}; // 아이템 수정 버튼


var editItem = function editItem(event) {
  var selectedItem = {
    selectedItem: event.target.dataset.idx
  };
  sendHttpRequest('PUT', '/api/items', selectedItem).then(function (responseData) {
    console.log(responseData);
  })["catch"](function (err) {
    console.error(err, err.data);
  });
  viewItem();
}; // 아이템 수정 모드 취소


var cancelEdit = function cancelEdit() {
  var selectedItem = {
    selectedItem: -1
  };
  sendHttpRequest('PUT', '/api/items', selectedItem).then(function (responseData) {
    console.log(responseData);
  })["catch"](function (err) {
    console.error(err, err.data);
  });
  viewItem();
}; // 아이템 수정


var updateItem = function updateItem(event) {
  event.preventDefault(); // 특정 아이템을 찾아서 업데이트

  var itemId = event.target.querySelector('input').dataset.idx;
  var item = {
    content: event.target.querySelector('input').value
  };
  sendHttpRequest('PUT', '/api/items/' + itemId, item).then(function (responseData) {
    console.log(responseData);
  })["catch"](function (err) {
    console.error(err, err.data);
  });
  viewItem();
}; // 아이템 토글


var toggleItem = function toggleItem(event) {
  var itemId = event.target.dataset.idx;
  sendHttpRequest('PUT', '/api/items/toggle/' + itemId).then(function (responseData) {
    console.log(responseData);
  })["catch"](function (err) {
    console.error(err, err.data);
  });
  viewItem();
}; // 아이템 삭제


var deleteItem = function deleteItem(event) {
  var itemId = event.target.dataset.idx;
  sendHttpRequest('DELETE', '/api/items/' + itemId).then(function (responseData) {
    console.log(responseData);
  })["catch"](function (err) {
    console.error(err, err.data);
  });
  viewItem();
};

viewItem(); // 아이템 조회 실행
//이벤트 등록

setEvent();