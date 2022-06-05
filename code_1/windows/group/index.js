var data = JSON.parse(decodeURI(getUrlParams("data")));
var group = getData("group") || [];
var content = getData("content") || [];
window.onload = function () {
  if (data) {
    getId("delete").style.display = "block";
    getId("title").innerHTML = "Edit Group";
    for (var key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        if (getId(key)) {
          getId(key).value = data[key];
        }
      }
    }
  }
};

// save group
function handleSave() {
  var name = getId("groupName").value;
  if (!name) {
    alert("please input group name");
    return;
  }
  // identify same name in group
  var item = group.find(function (el) {
    return el.groupName == name;
  });
  if (data) {
    // 编辑
    if (item && item.id != data.id) {
      alert("the group name is already exist");
      return;
    }
    for (var i = 0; i < group.length; i++) {
      if (group[i].id == data.id) {
        group[i].groupName = name;
      }
    }
  } else {
    // add group
    if (item) {
      alert("the group name is already exist");
      return;
    }
    group.push({ id: new Date().getTime(), groupName: name });
  }
  setData("group", JSON.stringify(group));
  setTimeout(() => {
    handleCancel({ type: "group" });
  }, 100);
}

// delete group
function handleDelete() {
  var newGroup = [];
  var newContent = [];
  for (var i = 0; i < group.length; i++) {
    if (group[i].id != data.id) {
      newGroup.push(group[i]);
    }
  }
  for (var i = 0; i < content.length; i++) {
    if (content[i].groupName != data.id) {
      newContent.push(content[i]);
    }
  }
  setData("group", JSON.stringify(newGroup));
  setData("content", JSON.stringify(newContent));
  setTimeout(() => {
    handleCancel({ type: "group" });
  }, 100);
}
