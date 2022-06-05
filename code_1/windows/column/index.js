var data = JSON.parse(decodeURI(getUrlParams("data")));
var column = getData("column") || [];
var task = getData("task") || [];
window.onload = function () {
  if (data) {
    getId("delete").style.display = "block";
    getId("title").innerHTML = "Edit Column";
    for (var key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        if (getId(key)) {
          getId(key).value = data[key];
        }
      }
    }
  }
};

// save column
function handleSave() {
  var name = getId("columnName").value;
  if (!name) {
    alert("please input column name");
    return;
  }
  // identify whether there is a same name 
  var item = column.find(function (el) {
    return el.columnName == name;
  });
  if (data) {
    // Edit column
    if (item && item.id != data.id) {
      alert("the column name is already exist");
      return;
    }
    for (var i = 0; i < column.length; i++) {
      if (column[i].id == data.id) {
        column[i].columnName = name;
      }
    }
  } else {
    // add column
    if (item) {
      alert("the column name is already exist");
      return;
    }
    column.push({ id: new Date().getTime(), columnName: name });
  }
  setData("column", JSON.stringify(column));
  setTimeout(() => {
    handleCancel({ type: "column" });
  }, 100);
}

// delet column
function handleDelete() {
  var newColumn = [];
  var newTask = [];
  for (var i = 0; i < column.length; i++) {
    if (column[i].id != data.id) {
      newColumn.push(column[i]);
    }
  }
  for (var i = 0; i < task.length; i++) {
    if (task[i].columnName != data.id) {
      newTask.push(task[i]);
    }
  }
  setData("column", JSON.stringify(newColumn));
  setData("task", JSON.stringify(newTask));
  setTimeout(() => {
    handleCancel({ type: "column" });
  }, 100);
}
