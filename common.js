// 根据id获取dom
function getId(name) {
  return document.getElementById(name);
}

// 根据classname获取dom
function getClass(name) {
  return document.getElementsByClassName(name);
}

// 获取本地数据
function getData(name) {
  return JSON.parse(localStorage.getItem(name));
}

// 数据存储本地
function setData(name, obj) {
  localStorage.setItem(name, obj);
}
// 关闭页面
function handleCancel(type) {
  window.parent.postMessage(type, "*");
}
// 获取url传参
function getUrlParams(key) {
  var arr = window.location.search.slice(1).split("&");
  var obj = {};
  for (var i = 0; i < arr.length; i++) {
    var el = arr[i].split("=");
    obj[el[0]] = el[1];
  }
  return obj[key];
}
