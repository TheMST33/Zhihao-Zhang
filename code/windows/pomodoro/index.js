var workTimeShow = 5;
var breakTimeShow = 5;
var loopTimeShow = 1;
var workTime = 0;
var breakTime = 0;
var loopTime = 1;
var workTimer;
var breakTimer;
window.onload = function () {};

// work minus
function handleMinusWork() {
  workTimeShow -= 5;
  if (workTimeShow < 5) {
    workTimeShow = 5;
    getId("work").innerHTML = "05:00";
  } else if (workTimeShow < 10) {
    getId("work").innerHTML = "0" + workTimeShow.toString() + ":00";
  } else {
    getId("work").innerHTML = workTimeShow + ":00";
  }
}

// work plus
function handlePlusWork() {
  workTimeShow += 5;
  if (workTimeShow < 10) {
    getId("work").innerHTML = "0" + workTimeShow.toString() + ":00";
  } else {
    getId("work").innerHTML = workTimeShow + ":00";
  }
}

// break minus
function handleMinusBreak() {
  breakTimeShow -= 5;
  if (breakTimeShow < 5) {
    breakTimeShow = 5;
    getId("break").innerHTML = "05:00";
  } else if (breakTimeShow < 10) {
    getId("break").innerHTML = "0" + breakTimeShow.toString() + ":00";
  } else {
    getId("break").innerHTML = breakTimeShow + ":00";
  }
}

// break plus
function handlePlusBreak() {
  breakTimeShow += 5;
  if (breakTimeShow < 10) {
    getId("break").innerHTML = "0" + breakTimeShow.toString() + ":00";
  } else {
    getId("break").innerHTML = breakTimeShow + ":00";
  }
}

// loop minus
function handleMinusLoop() {
  loopTimeShow -= 1;
  if (loopTimeShow < 1) {
    loopTimeShow = 1;
  }
  getId("loop").innerHTML = loopTimeShow;
  loopTime = loopTimeShow;
}

// loop plus
function handlePlusLoop() {
  loopTimeShow += 1;
  getId("loop").innerHTML = loopTimeShow;
  loopTime = loopTimeShow;
}

// 开始
function handleStart() {
  getId("start").style.display = "none";
  getId("end").style.display = "block";
  getId("set").style.display = "none";
  getId("pomodoro").style.display = "block";
  getId("back").style.display = "none";
  workTime = workTimeShow * 60;
  getId("pomodoro").innerHTML = getTime(workTime);
  loopTime -= 1;
  workTimer = setInterval(() => {
    workTime -= 1;
    getId("pomodoro").innerHTML = getTime(workTime);
    handleCancel({ type: "pomodoro", time: getTime(workTime) });
    if (workTime == 0) {
      clearInterval(workTimer);
      workTimer = undefined;
      if (loopTime != 0) {
        breakTime = breakTimeShow * 60;
        breakTimer = setInterval(() => {
          breakTime -= 1;
          if (breakTime == 0) {
            clearInterval(breakTimer);
            breakTimer = undefined;
            handleStart();
          }
        }, 1000);
      }
    }
  }, 1000);
}

// 结束
function handleEnd() {
  if (workTimer) {
    clearInterval(workTimer);
    workTimer = undefined;
  }
  if (breakTimer) {
    clearInterval(breakTimer);
    breakTimer = undefined;
  }
  workTimeShow = 5;
  breakTimeShow = 5;
  loopTimeShow = 1;
  loopTime = 0;
  workTime = 0;
  breakTime = 0;
  getId("back").style.display = "inline-block";
  getId("pomodoro").innerHTML = "00:00";
  getId("start").style.display = "block";
  getId("end").style.display = "none";
  getId("set").style.display = "block";
  getId("pomodoro").style.display = "none";
}

// 打开正向计时器页面
function handleOpenTime() {
  handleEnd();
  handleCancel({ type: "time", isOpen: 1 });
}
