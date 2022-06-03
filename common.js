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
function handleCancel(data) {
  window.parent.postMessage(data, "*");
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

// 获取时间
function getTime(time) {
  var sec = time % 60;
  if (sec < 10) {
    sec = "0" + sec.toString();
  }
  var min = Math.floor(time / 60) % 60;
  if (min < 10) {
    min = "0" + min.toString();
  }
  var hour = Math.floor(time / 3600);
  if (hour == 0) {
    hour = "";
  } else if (sec < 10) {
    hour = "0" + hour.toString() + ":";
  }
  return hour + min + ":" + sec;
}
