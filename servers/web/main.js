const $ = document.querySelector.bind(document);

const temp = $("#temp");
const hump = $("#hump");
const start_date = $("#start-date");
const _date = $("#_date");
const setupTemp = $("#setupTemp");
const submitTemp = $("#submitTemp");
const setup_temperature = $("#temperature");
const setupTime = $("#setupTime");
const submitsetupTime = $("#submitsetupTime");
const _time = $("#_time");
const savedDate = localStorage.getItem("selectedDate");
const a = localStorage.getItem("daysUntilSelected");
const lightButton = document.getElementById("lightButton");
const lightOff = $("#LightOFF");
const lightOn = $("#LightON");
const motorOFF = $("#motorOFF");
const motorON = $("#motorON");
const FAN_A_ON = $("#FAN_A_ON");
const FAN_A_OFF = $("#FAN_A_OFF");
const FAN_B_ON = $("#FAN_B_ON");
const FAN_B_OFF = $("#FAN_B_OFF");
const Motorstatus = $("#Motorstatus");
const FAN_A_status = $("#FAN_A_status");
const FAN_B_status = $("#FAN_B_status");
const url_temp = "http://127.0.0.1:3000/Temp";
const url_motor = "http://127.0.0.1:3000/Motor";

function fetchData() {
  fetch("http://127.0.0.1:3000/data")
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      console.log(data);
      let datalenght = data.data.length - 1;
      temp.innerText = data.data[datalenght].temperature;
      hump.innerText = data.data[datalenght].humidity;
    });
}
// setInterval(fetchData, 2000);

b = 1;
if (b == 1) {
  lightOff.classList.toggle("hidden");
  lightButton.classList.toggle("bg-green-300");
  lightOn.classList.toggle("hidden");
} else {
  lightOff.classList.remove("hidden");
  lightButton.classList.remove("bg-green-300");
}

if (b == 1) {
  motorOFF.classList.toggle("hidden");
  Motorstatus.classList.toggle("bg-green-300");
  motorON.classList.toggle("hidden");
} else {
  motorOFF.classList.remove("hidden");
  Motorstatus.classList.remove("bg-green-300");
}

if (b == 1) {
  FAN_A_OFF.classList.toggle("hidden");
  FAN_A_status.classList.toggle("bg-green-300");
  FAN_A_ON.classList.toggle("hidden");
} else {
  FAN_A_OFF.classList.remove("hidden");
  FAN_A_status.classList.remove("bg-green-300");
}

if (b == 1) {
  FAN_B_OFF.classList.toggle("hidden");
  FAN_B_status.classList.toggle("bg-green-300");
  FAN_B_ON.classList.toggle("hidden");
} else {
  FAN_B_OFF.classList.remove("hidden");
  FAN_B_status.classList.remove("bg-green-300");
}
function setApiTemp(value) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Xác định loại dữ liệu là JSON
    },
    body: JSON.stringify({ value }), // Chuyển đổi dữ liệu thành chuỗi JSON trước khi gửi
  };
  fetch(url_temp, options)
    .then((data) => {
      console.log("Dữ liệu đã được gửi thành công:", data);
    })
    .catch((error) => {
      console.error("Lỗi khi gửi dữ liệu:", error);
    });
}

function setApiTime(value) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Xác định loại dữ liệu là JSON
    },
    body: JSON.stringify({ value }), // Chuyển đổi dữ liệu thành chuỗi JSON trước khi gửi
  };
  fetch(url_motor, options)
    .then((data) => {
      console.log("Dữ liệu đã được gửi thành công:", data);
    })
    .catch((error) => {
      console.error("Lỗi khi gửi dữ liệu:", error);
    });
}

submitTemp.addEventListener("click", (e) => {
  let setupTempInput = parseInt(setupTemp.value);
  if (setupTempInput > 0 && setupTempInput < 100 && !isNaN(setupTempInput)) {
    e.preventDefault();
    console.log(setupTempInput);
    localStorage.setItem("setuptemp", setupTempInput);
    setApiTemp(setupTempInput);
    setup_temperature.innerText = `${localStorage.getItem("setuptemp")} °C`;
    setupTemp.value = "";
  } else {
    e.preventDefault();
    alert("Vui lòng nhập giá trị từ 0 đến 100");
  }
});

submitsetupTime.addEventListener("click", (e) => {
  let setupTimeInput = parseInt(setupTime.value);
  if (setupTimeInput > 0 && setupTimeInput < 100 && !isNaN(setupTimeInput)) {
    e.preventDefault();
    console.log(setupTimeInput);
    localStorage.setItem("setupTime", setupTimeInput);
    setApiTime(setupTimeInput);
    _time.innerText = `${localStorage.getItem("setupTime")} phút`;
    setupTime.value = "";
  } else {
    e.preventDefault();
    alert("Vui lòng nhập giá trị từ 0 đến 100");
  }
});

function daysBetween(startDate, endDate) {
  const oneDay = 1000 * 60 * 60 * 24;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInTime = end.getTime() - start.getTime();
  const diffInDays = Math.round(diffInTime / oneDay);
  return diffInDays;
}

start_date.addEventListener("change", function () {
  const startDate = this.value;
  const today = new Date().toISOString().split("T")[0]; // Get today's date in yyyy-mm-dd format
  const daysUntilSelected = daysBetween(today, startDate);
  localStorage.setItem("selectedDate", startDate);
  localStorage.setItem("daysUntilSelected", daysUntilSelected);
  _date.textContent = `Số ngày còn lại: ${localStorage.getItem(
    "daysUntilSelected"
  )} ngày`;
});
if (
  localStorage.getItem("selectedDate") |
  localStorage.getItem("daysUntilSelected") |
  localStorage.getItem("setuptemp") |
  localStorage.getItem("setupTime")
) {
  document.getElementById("start-date").value = savedDate;
  _date.textContent = `Số ngày còn lại: ${a} ngày`;
  setup_temperature.innerText = `${localStorage.getItem("setuptemp")} °C`;
  _time.innerText = `${localStorage.getItem("setupTime")} phút`;
}
