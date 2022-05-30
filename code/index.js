var height = window.innerHeight - 248;
var sort = "asce";
var playing = 0;
var playType = "list";
var musicTimer;
var currentTime = 0;
var durationTime = 0;
var musicList = [{
    id: "1", // 音乐ID
    name: "成都", // 音乐名字
    user: "赵雷", // 艺术家名字
    pic: "./music/成都.webp", // 专辑图片
    url: "./music/成都.mp3",
    time: "05:28"
  },
  {
    id: "2",
    name: "三寸天堂",
    user: "严艺丹",
    pic: "./music/三寸天堂.webp",
    url: "./music/三寸天堂.mp3",
    time: "04:50"
  },
  {
    id: "3",
    name: "一生所爱",
    user: "莫文蔚",
    pic: "./music/一生所爱.webp",
    url: "./music/一生所爱.mp3",
    time: "04:33"
  },
  {
    id: "4",
    name: "冬天的秘密",
    user: "周传雄",
    pic: "./music/冬天的秘密.webp",
    url: "./music/冬天的秘密.mp3",
    time: "04:32"
  },
];
window.onload = function () {
  // 监听弹框事件
  window.addEventListener(
    "message",
    function (e) {
      switch (e.data.type) {
        case "column":
          toggleWindow();
          getColumn();
          break;
        case "task":
          toggleWindow();
          getColumn();
          break;
        case "group":
          toggleWindow();
          getGroup();
          break;
        case "content":
          toggleWindow();
          getGroup();
          break;
        case "time":
          if (e.data.time) {
            getId("time").innerHTML = e.data.time;
          } else if (e.data.isOpen) {
            getId("time-iframe").setAttribute(
              "src",
              "./windows/time/index.html"
            );
          } else {
            getId("time-box").style.display = "none";
          }
          break;
        case "pomodoro":
          if (e.data.time) {
            getId("time").innerHTML = e.data.time;
          } else if (e.data.isOpen) {
            getId("time-iframe").setAttribute(
              "src",
              "./windows/pomodoro/index.html"
            );
          } else {
            getId("time-box").style.display = "none";
          }
          break;

        default:
          break;
      }
    },
    false
  );
  getColumn();
  getFooter(musicList[playing]);
};

// 导航栏按钮点击事件
function handleBar(e, name) {
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
    getColumn();
  } else {
    getId("column").style.display = "none";
    getId("group").style.display = "block";
    getId("column-add").style.display = "none";
    getId("group-add").style.display = "flex";
    getGroup();
  }
}

// 弹窗页面打开方法
function handleOpenWindow(name, obj) {
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
  var dom = "";
  if (column.length) {
    for (var i = 0; i < column.length; i++) {
      var el = column[i];
      var child = getTask(el);
      dom +=
        "<div class='body-column-item' style='height:" +
        height +
        "px'><div id='" +
        el.id +
        "' class='body-colum-item-con'><div class='body-colum-item-con-title'><div class='body-colum-item-con-title-name'>" +
        el.columnName +
        "</div><div class='body-colum-item-con-title-btn' onclick=handleEditColumn('" +
        el.id +
        "')>E</div></div>" +
        child +
        "</div></div>";
    }
  }
  getId("column").innerHTML = dom;
}

// 获取column下的task
function getTask(obj) {
  var task = getData("task") || [];
  var dom = "";
  if (task.length) {
    for (var i = 0; i < task.length; i++) {
      var el = task[i];
      if (el.columnName == obj.id) {
        dom +=
          "<div class='body-colum-item-con-card'><div class='body-colum-item-con-card-header'><div class='body-colum-item-con-card-header-name'>" +
          el.taskName +
          "</div><img class='body-colum-item-con-card-header-icon' src='./assets/lock.svg' alt=''><div class='body-colum-item-con-card-header-time'>" +
          el.date +
          "</div></div><div class='body-colum-item-con-card-body'><div class='body-colum-item-con-card-body-title'>" +
          el.descriptionTitle +
          "</div><div class='body-colum-item-con-card-body-sub'>" +
          el.description +
          "</div></div><div class='body-colum-item-con-card-footer'><div class='body-colum-item-con-card-footer-btn' onclick=handleEditTask('" +
          el.id +
          "')>Edit</div><div class='body-colum-item-con-card-footer-time'>" +
          getTimeStr(el) +
          "</div></div></div>";
      }
    }
  }
  return dom;
}

// 获取task的时间显示
function getTimeStr(data) {
  var dom = "";
  if (data.hr != "00") {
    dom += data.hr + " HR";
  }
  if (data.min != "00") {
    dom += data.min + " min";
  }
  return dom;
}

// 修改column
function handleEditColumn(id) {
  var column = getData("column") || [];
  var data = column.find(function (el) {
    return el.id == id;
  });
  handleOpenWindow("column", data);
}

// 修改task
function handleEditTask(id) {
  var task = getData("task") || [];
  var data = task.find(function (el) {
    return el.id == id;
  });
  handleOpenWindow("task", data);
}

// 获取Group列表
function getGroup() {
  var group = getData("group") || [];
  if (sort == "asce") {
    group.sort(function (a, b) {
      var x = a.groupName.toLowerCase();
      var y = b.groupName.toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
  } else {
    group.sort(function (a, b) {
      var x = a.groupName.toLowerCase();
      var y = b.groupName.toLowerCase();
      if (x < y) {
        return 1;
      }
      if (x > y) {
        return -1;
      }
      return 0;
    });
  }
  var dom =
    "<div class='body-group-sort' onclick=handleSort()><div class='body-group-sort-btn'><img id='sort' class='body-group-sort-btn-icon' src='./assets/" +
    sort +
    ".svg' alt=''><div class='body-group-sort-btn-name'>Group Name</div></div></div>";
  if (group.length) {
    for (var i = 0; i < group.length; i++) {
      var el = group[i];
      var child = getContent(el);
      dom +=
        "<div class='body-group-item'><div class='body-group-item-header'><div class='body-group-item-header-name'>" +
        el.groupName +
        "</div><div class='body-group-item-header-edit' onclick=handleEditGroup('" +
        el.id +
        "')>E</div><div class='body-group-item-header-all' onclick=handleOpenAll('" +
        el.id +
        "')>Open All</div></div>" +
        child +
        "</div>";
    }
  }
  getId("group").innerHTML = dom;
}

// 获取group下的content
function getContent(obj) {
  var content = getData("content") || [];
  var dom = "";
  if (content.length) {
    for (var i = 0; i < content.length; i++) {
      var el = content[i];
      if (el.groupName == obj.id) {
        dom +=
          "<div class='body-group-item-content'><div class='body-group-item-content-left'><div class='body-group-item-content-left-top'><div class='body-group-item-content-left-top-con'><div class='body-group-item-content-left-top-con-name'>" +
          el.contentName +
          "</div><div class='body-group-item-content-left-top-con-edit' onclick=handleEditContent('" +
          el.id +
          "')>Edit</div></div><div class='body-group-item-content-left-top-blank'></div></div><div class='body-group-item-content-left-bottom'>" +
          el.description +
          "</div></div><img class='body-group-item-content-right' src='./assets/link.svg' alt='' onclick=handleOpenLink('" +
          el.id +
          "')></div>";
      }
    }
  }
  return dom;
}

// 修改group
function handleEditGroup(id) {
  var group = getData("group") || [];
  var data = group.find(function (el) {
    return el.id == id;
  });
  handleOpenWindow("group", data);
}

// 修改content
function handleEditContent(id) {
  var content = getData("content") || [];
  var data = content.find(function (el) {
    return el.id == id;
  });
  handleOpenWindow("content", data);
}

// 打开链接
function handleOpenLink(id) {
  var content = getData("content") || [];
  var data = content.find(function (el) {
    return el.id == id;
  });
  window.open(data.link);
}

// 打开全部链接
function handleOpenAll(id) {
  var content = getData("content") || [];
  content.forEach(function (el) {
    if (el.groupName == id) {
      window.open(el.link);
    }
  });
}

// group排序
function handleSort() {
  if (sort == "asce") {
    sort = "desc";
  } else {
    sort = "asce";
  }
  getGroup();
}

// 打开计时器页面
function handleOpenTime() {
  getId("time-box").style.display = "block";
}

// 获取底部音乐信息
function getFooter(data) {
  getId("audio").setAttribute("src", musicList[playing].url);
  getId("footerMusic").innerHTML = "<img src='" + data.pic + "' alt='' class='footer-left-img' /><div class='footer-left-con'><div class='footer-left-con-name'>" + data.name + "</div><div class='footer-left-con-user'>" + data.user + "</div></div>"
  setTimeout(() => {
    durationTime = getId("audio").duration;
    getId("current").innerHTML = getTime(Math.floor(currentTime));
    getId("duration").innerHTML = getTime(Math.floor(durationTime));
  }, 100);
}

// play
function handlePlay() {
  getId("audio").play();
  getId("play").style.display = "none";
  getId("pause").style.display = "inline-block";
  getMusicList();
  musicTimer = setInterval(() => {
    activeProgressBar();
  }, 100);
}

// pause
function handlePause() {
  getId("audio").pause();
  getId("pause").style.display = "none";
  getId("play").style.display = "inline-block";
  clearInterval(musicTimer);
  musicTimer = undefined;
}

// last
function handleLast() {
  handlePause();
  switch (playType) {
    case "list":
      playing -= 1;
      break;
    case "one":
      playing -= 1;
      break;
    case "shuffle":
      playing = getMusicNum(playing);
      break;
    default:
      break;
  }
  if (playing < 0) {
    playing = musicList.length - 1;
  }
  getFooter(musicList[playing]);
  setTimeout(() => {
    handlePlay()
  }, 100);
}

// next
function handleNext() {
  handlePause();
  switch (playType) {
    case "list":
      playing += 1;
      break;
    case "one":
      playing += 1;
      break;
    case "shuffle":
      playing = getMusicNum(playing);
      break;
    default:
      break;
  }
  if (playing == musicList.length) {
    playing = 0;
  }
  getFooter(musicList[playing]);
  setTimeout(() => {
    handlePlay()
  }, 100);
}

// list
function handleList() {
  getId("list").style.display = "none";
  getId("one").style.display = "inline-block";
  playType = "one";
}

// one
function handleOne() {
  getId("one").style.display = "none";
  getId("shuffle").style.display = "inline-block";
  playType = "shuffle";
}

// shuffle
function handleShuffle() {
  getId("shuffle").style.display = "none";
  getId("list").style.display = "inline-block";
  playType = "list";
}

// 激活进度条
function activeProgressBar() {
  currentTime = getId("audio").currentTime;
  getId("current").innerHTML = getTime(Math.floor(currentTime));
  var percentNum =
    Math.floor((currentTime / durationTime) * 10000) /
    100 +
    "%";
  getId("progress").style.width = percentNum;
  if (percentNum == "100%") {
    handleNext();
  }
}

// 打开音乐列表
function showMusicList() {
  getId("musicBg").style.display = "block";
  getId("show").style.display = "none";
  getId("hide").style.display = "inline-block";
  getMusicList();
}

// 关闭音乐列表
function hideMusicList() {
  getId("musicBg").style.display = "none";
  getId("hide").style.display = "none";
  getId("show").style.display = "inline-block";
}

// 获取音乐列表数据
function getMusicList() {
  var str = "<div class='music-body-left'><img src='" + musicList[playing].pic + "' class='music-body-left-pic' alt='' /><div class='music-body-left-name'>" + musicList[playing].name + "</div><div class='music-body-left-user'>" + musicList[playing].user + "</div></div><div class='music-body-right'><div class='music-body-right-header'><div class='music-body-right-header-title'>List</div><img class='music-body-right-header-icon' onclick='hideMusicList()' src='./assets/hide-white.svg' /></div><div class='music-body-right-con'>";
  musicList.forEach(function (el, i) {
    str += "<div class='music-body-right-con-item' onclick=handleChangeMusic('" + i + "')><div class='music-body-right-con-item-left'><img class='music-body-right-con-item-left-img' src='" + el.pic + "' alt=''>";
    if (playing == i) {
      str += "<img class='music-body-right-con-item-left-icon' src='./assets/play.svg' alt=''>"
    }
    str += "</div><div class='music-body-right-con-item-center'><div class='music-body-right-con-item-center-name'>" + el.name + "</div><div class='music-body-right-con-item-center-user'>" + el.user + "</div></div><div class='music-body-right-con-item-right'>" + el.time + "</div></div>"
  });
  str += "</div></div>";
  getId("musicBody").innerHTML = str;
}

// 音乐列表点击切换歌曲
function handleChangeMusic(key) {
  playing = key
  getFooter(musicList[playing]);
  setTimeout(() => {
    handlePlay()
  }, 100);
}

// 获取随机音乐key
function getMusicNum(num) {
  var key = Math.floor(Math.random() * musicList.length);
  if (key == num) {
    return getMusicNum(num)
  }
  return key
}