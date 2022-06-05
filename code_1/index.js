var height = window.innerHeight - 248;
var sort = "asce";
var playing = 0;
var playType = "list";
var musicTimer;
var currentTime = 0;
var durationTime = 0;
//music function contained in this doc
var musicList = [
  {
    id: "1", // music id
    name: "成都", // music name
    user: "赵雷", // singer name
    pic: "./music/成都.webp", // image
    url: "./music/成都.mp3", //music link
    time: "05:28", //time
  },
  {
    id: "2",
    name: "三寸天堂",
    user: "严艺丹",
    pic: "./music/三寸天堂.webp",
    url: "./music/三寸天堂.mp3",
    time: "04:50",
  },
  {
    id: "3",
    name: "一生所爱",
    user: "莫文蔚",
    pic: "./music/一生所爱.webp",
    url: "./music/一生所爱.mp3",
    time: "04:33",
  },
  {
    id: "4",
    name: "冬天的秘密",
    user: "周传雄",
    pic: "./music/冬天的秘密.webp",
    url: "./music/冬天的秘密.mp3",
    time: "04:32",
  },
];
var moveData;
window.onload = function () {
  // pop-up pages
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

// the things contained in the nav bar
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

// the way of open the pop-ups
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

// pages open, close/ iframe
function toggleWindow(type, url) {
  if (type == 1) {
    getId("window-box").style.display = "block";
    getId("window-iframe").setAttribute("src", url);
  } else {
    getId("window-box").style.display = "none";
    getId("window-iframe").setAttribute("src", "");
  }
}

// get the column list 
function getColumn() {
  var column = getData("column") || [];
  var dom = "";
  if (column.length) {
    for (var i = 0; i < column.length; i++) {
      var el = column[i];
      var child = getTask(el);
      dom +=
        "<div data='" +
        JSON.stringify(el) +
        "' class='body-column-item' ondrop='dropColumn(event, this)'  ondragover='allowDropColumn(event)' style='height:" +
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

// get the task details contained in the column
function getTask(obj) {
  var task = getData("task") || [];
  var dom = "";
  if (task.length) {
    for (var i = 0; i < task.length; i++) {
      var el = task[i];
      if (el.columnName == obj.id) {
        dom +=
          "<div data='" +
          JSON.stringify(el) +
          "' class='body-colum-item-con-card' draggable='true' ondragstart='dragStartTask(event,this)'><div class='body-colum-item-con-card-header'><div class='body-colum-item-con-card-header-name'>" +
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

// move task
function dragStartTask(event, dom) {
  moveData = JSON.parse(dom.getAttribute("data"));
}

// task enter columns 
function allowDropColumn(event) {
  event.preventDefault();
}

// task finish moving
function dropColumn(event, dom) {
  var task = getData("task") || [];
  var newTask = [];
  var enterColumn = JSON.parse(dom.getAttribute("data"));
  if (enterColumn.id == moveData.columnName) {
    moveData = null;
  } else {
    if (task.length) {
      for (var i = 0; i < task.length; i++) {
        var el = task[i];
        if (el.id != moveData.id) {
          newTask.push(el);
        }
      }
      moveData.columnName = enterColumn.id;
      newTask.push(moveData);
      setData("task", JSON.stringify(newTask));
      getColumn();
    }
  }
}

// gthe time of task
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

// changing column
function handleEditColumn(id) {
  var column = getData("column") || [];
  var data = column.find(function (el) {
    return el.id == id;
  });
  handleOpenWindow("column", data);
}

// chaning task 
function handleEditTask(id) {
  var task = getData("task") || [];
  var data = task.find(function (el) {
    return el.id == id;
  });
  handleOpenWindow("task", data);
}

// get the lists of group
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
        "<div data='" +
        JSON.stringify(el) +
        "' ondrop='dropGroup(event, this)' ondragover='allowDropGroup(event)' class='body-group-item'><div class='body-group-item-header'><div class='body-group-item-header-name'>" +
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

// get the contents 
function getContent(obj) {
  var content = getData("content") || [];
  var dom = "";
  if (content.length) {
    for (var i = 0; i < content.length; i++) {
      var el = content[i];
      if (el.groupName == obj.id) {
        dom +=
          "<div data='" +
          JSON.stringify(el) +
          "' class='body-group-item-content' draggable='true' ondragstart='dragStartContent(event,this)'><div class='body-group-item-content-left'><div class='body-group-item-content-left-top'><div class='body-group-item-content-left-top-con'><div class='body-group-item-content-left-top-con-name'>" +
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

// miving content
function dragStartContent(event, dom) {
  moveData = JSON.parse(dom.getAttribute("data"));
}

// enter differnent groups
function allowDropGroup(event) {
  event.preventDefault();
}

// finish moving
function dropGroup(event, dom) {
  var content = getData("content") || [];
  var newContent = [];
  var enterGroup = JSON.parse(dom.getAttribute("data"));
  if (enterGroup.id == moveData.groupName) {
    moveData = null;
  } else {
    if (content.length) {
      for (var i = 0; i < content.length; i++) {
        var el = content[i];
        if (el.id != moveData.id) {
          newContent.push(el);
        }
      }
      moveData.groupName = enterGroup.id;
      newContent.push(moveData);
      setData("content", JSON.stringify(newContent));
      getGroup();
    }
  }
}

// changing group
function handleEditGroup(id) {
  var group = getData("group") || [];
  var data = group.find(function (el) {
    return el.id == id;
  });
  handleOpenWindow("group", data);
}

// changing content
function handleEditContent(id) {
  var content = getData("content") || [];
  var data = content.find(function (el) {
    return el.id == id;
  });
  handleOpenWindow("content", data);
}

//  open single link
function handleOpenLink(id) {
  var content = getData("content") || [];
  var data = content.find(function (el) {
    return el.id == id;
  });
  window.open(data.link);
}

// open all the links in the group
function handleOpenAll(id) {
  var content = getData("content") || [];
  content.forEach(function (el) {
    if (el.groupName == id) {
      window.open(el.link);
    }
  });
}

// sort groups, from a-z and z-a
function handleSort() {
  if (sort == "asce") {
    sort = "desc";
  } else {
    sort = "asce";
  }
  getGroup();
}

// open the page of timer
function handleOpenTime() {
  getId("time-box").style.display = "block";
}

// get the music information, in the bottom
function getFooter(data) {
  getId("audio").setAttribute("src", musicList[playing].url);
  getId("footerMusic").innerHTML =
    "<img src='" +
    data.pic +
    "' alt='' class='footer-left-img' /><div class='footer-left-con'><div class='footer-left-con-name'>" +
    data.name +
    "</div><div class='footer-left-con-user'>" +
    data.user +
    "</div></div>";
  setTimeout(() => {
    durationTime = getId("audio").duration;
    getId("current").innerHTML = getTime(Math.floor(currentTime));
    getId("duration").innerHTML = getTime(Math.floor(durationTime));
  }, 100);
}

// play music
function handlePlay() {
  getId("audio").play();
  getId("play").style.display = "none";
  getId("pause").style.display = "inline-block";
  getMusicList();
  musicTimer = setInterval(() => {
    activeProgressBar();
  }, 100);
}

// pause music
function handlePause() {
  getId("audio").pause();
  getId("pause").style.display = "none";
  getId("play").style.display = "inline-block";
  clearInterval(musicTimer);
  musicTimer = undefined;
}

// the last music which has played
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
    handlePlay();
  }, 100);
}

// next music in the list
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
    handlePlay();
  }, 100);
}

// music list
function handleList() {
  getId("list").style.display = "none";
  getId("one").style.display = "inline-block";
  playType = "one";
}

// play in single 
function handleOne() {
  getId("one").style.display = "none";
  getId("shuffle").style.display = "inline-block";
  playType = "shuffle";
}

// play in shuffle
function handleShuffle() {
  getId("shuffle").style.display = "none";
  getId("list").style.display = "inline-block";
  playType = "list";
}

// show the time of played of music
function activeProgressBar() {
  currentTime = getId("audio").currentTime;
  getId("current").innerHTML = getTime(Math.floor(currentTime));
  var percentNum = Math.floor((currentTime / durationTime) * 10000) / 100 + "%";
  getId("progress").style.width = percentNum;
  if (percentNum == "100%") {
    handleNext();
  }
}


// open the music list
function showMusicList() {
  getId("musicBg").style.display = "block";
  getId("show").style.display = "none";
  getId("hide").style.display = "inline-block";
  getMusicList();
}

// close music list
function hideMusicList() {
  getId("musicBg").style.display = "none";
  getId("hide").style.display = "none";
  getId("show").style.display = "inline-block";
}

// get the infor of music list
function getMusicList() {
  var str =
    "<div class='music-body-left'><img src='" +
    musicList[playing].pic +
    "' class='music-body-left-pic' alt='' /><div class='music-body-left-name'>" +
    musicList[playing].name +
    "</div><div class='music-body-left-user'>" +
    musicList[playing].user +
    "</div></div><div class='music-body-right'><div class='music-body-right-header'><div class='music-body-right-header-title'>List</div><img class='music-body-right-header-icon' onclick='hideMusicList()' src='./assets/hide-white.svg' /></div><div class='music-body-right-con'>";
  musicList.forEach(function (el, i) {
    str +=
      "<div class='music-body-right-con-item' onclick=handleChangeMusic('" +
      i +
      "')><div class='music-body-right-con-item-left'><img class='music-body-right-con-item-left-img' src='" +
      el.pic +
      "' alt=''>";
    if (playing == i) {
      str +=
        "<img class='music-body-right-con-item-left-icon' src='./assets/play.svg' alt=''>";
    }
    str +=
      "</div><div class='music-body-right-con-item-center'><div class='music-body-right-con-item-center-name'>" +
      el.name +
      "</div><div class='music-body-right-con-item-center-user'>" +
      el.user +
      "</div></div><div class='music-body-right-con-item-right'>" +
      el.time +
      "</div></div>";
  });
  str += "</div></div>";
  getId("musicBody").innerHTML = str;
}

// change the music when click
function handleChangeMusic(key) {
  playing = key;
  getFooter(musicList[playing]);
  setTimeout(() => {
    handlePlay();
  }, 100);
}

// get random music key
function getMusicNum(num) {
  var key = Math.floor(Math.random() * musicList.length);
  if (key == num) {
    return getMusicNum(num);
  }
  return key;
}
