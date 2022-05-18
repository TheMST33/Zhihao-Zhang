var height = window.innerHeight - 248;
window.onload = function () {
  // 监听弹框事件
  window.addEventListener(
    "message",
    function (e) {
      switch (e.data) {
        case ("column", "task"):
          toggleWindow();
          getColumn();
          break;

        default:
          break;
      }
    },
    false
  );
  getColumn();
};

// 导航栏按钮点击事件
function handerBar(e, name) {
  for (var i = 0; i < getClass("header-center-btn").length; i++) {
    var el = getClass("header-center-btn")[i];
    el.classList.remove("header-center-btn-active");
  }
  e.classList.add("header-center-btn-active");
  if (name === "column") {
    getId("column").style.display = "block";
    getId("group").style.display = "none";
    getId("column-add").style.display = "flex";
    getId("group-add").style.display = "none";
  } else {
    getId("column").style.display = "none";
    getId("group").style.display = "block";
    getId("column-add").style.display = "none";
    getId("group-add").style.display = "flex";
  }
}

// 弹窗页面打开方法
function handerOpenWindow(name, obj) {
  if (name == "task" && !(getData("column") && getData("column").length)) {
    alert("please create column first !");
    return;
  }
  if (name == "content" && !(getData("group") && getData("group").length)) {
    alert("please create group first !");
    return;
  }
  toggleWindow(
    1,
    "./windows/" +
      name +
      "/index.html?data=" +
      encodeURI(JSON.stringify(obj || ""))
  );
}

// 页面打开、关闭iframe
function toggleWindow(type, url) {
  if (type == 1) {
    getId("window-box").style.display = "block";
    getId("window-iframe").setAttribute("src", url);
  } else {
    getId("window-box").style.display = "none";
    getId("window-iframe").setAttribute("src", "");
  }
}

// 获取column列表
function getColumn() {
  var column = getData("column") || [];
  if (column.length) {
    var dom = "";
    for (var i = 0; i < column.length; i++) {
      var el = column[i];
      dom +=
        "<div class='body-column-item' style='height:" +
        height +
        "px'><div class='body-colum-item-con'><div class='body-colum-item-con-title'><div class='body-colum-item-con-title-name'>" +
        el.columnName +
        "</div><div class='body-colum-item-con-title-btn' onclick=handleDel('" +
        el.id +
        "')>E</div></div><div class='body-colum-item-con-card'><div class='body-colum-item-con-card-header'><div class='body-colum-item-con-card-header-name'>DECO1006</div><img class='body-colum-item-con-card-header-icon' src='./assets/lock.svg' alt=''><div class='body-colum-item-con-card-header-time'>11 May</div></div><div class='body-colum-item-con-card-body'><div class='body-colum-item-con-card-body-title'>Analysis the collected data from A2</div><div class='body-colum-item-con-card-body-sub'>Brief analysis the data from previous search, creating persona</div></div><div class='body-colum-item-con-card-footer'><div class='body-colum-item-con-card-footer-btn'>Edit</div><div class='body-colum-item-con-card-footer-time'>4 HR</div></div></div></div></div>";
    }
    getId("column").innerHTML = dom;
  }
}

// 删除column
function handleDel(id) {
  var column = getData("column") || [];
  var data = column.find(function (el) {
    return el.id == id;
  });
  handerOpenWindow("column", data);
}
