var data = JSON.parse(decodeURI(getUrlParams("data")));
var column = getData("column") || [];
var task = getData("task") || [];
var level = "Low";
window.onload = function () {
  var dom = "<option selected value='' disabled></option>";
  column.forEach(function (el) {
    dom += "<option value='" + el.id + "'>" + el.columnName + "</option>";
  });
  getId("columnName").innerHTML = dom;
  //level function 
  if (data) {
    getId("delete").style.display = "block";
    getId("title").innerHTML = "Edit Task";
    for (var i = 0; i < getClass("task-form-item-level-item").length; i++) {
      var el = getClass("task-form-item-level-item")[i];
      el.classList.remove("task-form-item-level-item-active");
      level = data.level;
      if (el.innerHTML == data.level) {
        el.classList.add("task-form-item-level-item-active");
      }
    }
    for (var key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        if (getId(key)) {
          getId(key).value = data[key];
        }
      }
    }
  }
};

// when click on the buttons of level
function handleLevel(e, type) {
  for (var i = 0; i < getClass("task-form-item-level-item").length; i++) {
    var el = getClass("task-form-item-level-item")[i];
    el.classList.remove("task-form-item-level-item-active");
  }
  e.classList.add("task-form-item-level-item-active");
  level = type;
}

// save task content
function handleSave() {
  var taskName = getId("taskName").value;
  var columnName = getId("columnName").value;
  var description = getId("description").value;
  var descriptionTitle = getId("descriptionTitle").value;
  var date = getId("date").value;
  var hr = getId("hr").value;
  var min = getId("min").value;
  if (
    !taskName ||
    !columnName ||
    !description ||
    !descriptionTitle ||
    !date ||
    !hr ||
    !min
  ) {
    alert("please input all");
    return;
  }
  // identify the same name
  var item = task.find(function (el) {
    return el.taskName == taskName && el.columnName == columnName;
  });
  if (data) {
    // edit task details
    if (item && item.id != data.id) {
      alert("the task name is already exist");
      return;
    }
    for (var i = 0; i < task.length; i++) {
      if (task[i].id == data.id) {
        task[i].taskName = taskName;
        task[i].columnName = columnName;
        task[i].description = description;
        task[i].descriptionTitle = descriptionTitle;
        task[i].date = date;
        task[i].hr = hr;
        task[i].min = min;
      }
    }
  } else {
    // add task details
    if (item) {
      alert("the task name is already exist");
      return;
    }
    task.push({
      id: new Date().getTime(),
      taskName: taskName,
      columnName: columnName,
      description: description,
      descriptionTitle: descriptionTitle,
      date: date,
      hr: hr,
      min: min,
      level: level,
    });
  }
  setData("task", JSON.stringify(task));
  setTimeout(() => {
    handleCancel({ type: "task" });
  }, 100);
}

// delete task
function handleDelete() {
  var arr = [];
  for (var i = 0; i < task.length; i++) {
    if (task[i].id != data.id) {
      arr.push(task[i]);
    }
  }
  setData("task", JSON.stringify(arr));
  setTimeout(() => {
    handleCancel({ type: "task" });
  }, 100);
}
