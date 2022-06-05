var data = JSON.parse(decodeURI(getUrlParams("data")));
var group = getData("group") || [];
var content = getData("content") || [];
var level = "Low";
window.onload = function () {
  var dom = "<option selected value='' disabled></option>";
  group.forEach(function (el) {
    dom += "<option value='" + el.id + "'>" + el.groupName + "</option>";
  });
  getId("groupName").innerHTML = dom;
  if (data) {
    getId("delete").style.display = "block";
    getId("title").innerHTML = "Edit Content";
    for (var i = 0; i < getClass("content-form-item-level-item").length; i++) {
      var el = getClass("content-form-item-level-item")[i];
      el.classList.remove("content-form-item-level-item-active");
      level = data.level;
      if (el.innerHTML == data.level) {
        el.classList.add("content-form-item-level-item-active");
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

// save content
function handleSave() {
  var contentName = getId("contentName").value;
  var groupName = getId("groupName").value;
  var description = getId("description").value;
  var link = getId("link").value;
  if (!contentName || !groupName || !description || !link) {
    alert("please input all");
    return;
  }
  // identify same name
  var item = content.find(function (el) {
    return el.contentName == contentName && el.groupName == groupName;
  });
  if (data) {
    // edit content details
    if (item && item.id != data.id) {
      alert("the content name is already exist");
      return;
    }
    for (var i = 0; i < content.length; i++) {
      if (content[i].id == data.id) {
        content[i].contentName = contentName;
        content[i].groupName = groupName;
        content[i].description = description;
        content[i].link = link;
      }
    }
  } else {
    // add content details
    if (item) {
      alert("the content name is already exist");
      return;
    }
    content.push({
      id: new Date().getTime(),
      contentName: contentName,
      groupName: groupName,
      description: description,
      link: link,
    });
  }
  setData("content", JSON.stringify(content));
  setTimeout(() => {
    handleCancel({ type: "content" });
  }, 100);
}

// delete content
function handleDelete() {
  var arr = [];
  for (var i = 0; i < content.length; i++) {
    if (content[i].id != data.id) {
      arr.push(content[i]);
    }
  }
  setData("content", JSON.stringify(arr));
  setTimeout(() => {
    handleCancel({ type: "content" });
  }, 100);
}
