// get dom based on the id
function getId(name) {
  return document.getElementById(name);
}

// get dom based on the class name
function getClass(name) {
  return document.getElementsByClassName(name);
}

// get local storage
function getData(name) {
  return JSON.parse(localStorage.getItem(name));
}

// save the data in the local storage
function setData(name, obj) {
  localStorage.setItem(name, obj);
}

// close pages 
function handleCancel(data) {
  window.parent.postMessage(data, "*");
}

// get url and transit elements
function getUrlParams(key) {
  var arr = window.location.search.slice(1).split("&");
  var obj = {};
  for (var i = 0; i < arr.length; i++) {
    var el = arr[i].split("=");
    obj[el[0]] = el[1];
  }
  return obj[key];
}

// get and set the time
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
