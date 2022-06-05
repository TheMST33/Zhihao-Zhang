//normal timer
var time = 0;
var timer;
window.onload = function () {};

// start timing
function handleStart() {
  timer = setInterval(() => {
    time += 1;
    getId("time").innerHTML = getTime(time);
    handleCancel({ type: "time", time: getTime(time) });
  }, 1000);
}

// stop timing 
function handleStop() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
}

// reset timing
function handleReset() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
  time = 0;
  getId("time").innerHTML = "00:00";
  handleCancel({ type: "time", time: "00:00" });
}

// open the page of pomodoro timer
function handleOpenPomodoro() {
  handleReset();
  handleCancel({ type: "pomodoro", isOpen: 1 });
}
