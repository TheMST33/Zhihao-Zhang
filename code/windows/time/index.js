var time = 0;
var timer;
window.onload = function () {};

// 开始
function handleStart() {
  timer = setInterval(() => {
    time += 1;
    getId("time").innerHTML = getTime(time);
    handleCancel({ type: "time", time: getTime(time) });
  }, 1000);
}

// 暂停
function handleStop() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
}

// 重置
function handleReset() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
  time = 0;
  getId("time").innerHTML = "00:00";
  handleCancel({ type: "time", time: "00:00" });
}

// 打开反向计时器页面
function handleOpenPomodoro() {
  handleReset();
  handleCancel({ type: "pomodoro", isOpen: 1 });
}
