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
      let datalength = data.data.length - 1;
      temp.innerText = data.data[datalength].temperature;
      hump.innerText = data.data[datalength].humidity;
      addData(
        data.data[datalength].temperature,
        data.data[datalength].humidity
      );

      updateStatus("lightStatus", data.data[datalength].Light);
      updateStatus("motorStatus", data.data[datalength].Motor);
      updateStatus("FAN_A_Status", data.data[datalength].FAN_A);
      updateStatus("FAN_B_Status", data.data[datalength].FAN_B);
    });
}
function updateStatus(elementId, status) {
  const element = document.getElementById(elementId);
  if (status === 1) {
    element.textContent = "ON";
    element.classList.remove("text-red-600");
    element.classList.add("text-green-600");
  } else {
    element.textContent = "OFF";
    element.classList.remove("text-green-600");
    element.classList.add("text-red-600");
  }
}
setInterval(fetchData, 1000);

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
    Toastify({
      text: "Vui lòng nhập giá trị từ 0 đến 100",
      style: {
        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
      },

      duration: 3000, // Thời gian hiển thị (ms)
      newWindow: true, // Mở toast trong cửa sổ mới
      close: true, // Hiển thị nút đóng toast
      gravity: "top", // Vị trí hiển thị toast
      position: "end", // Canh lề của toast
    }).showToast();
    setupTemp.value = null;
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

    Toastify({
      text: "Vui lòng nhập giá trị từ 0 đến 100",
      style: {
        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
      },
      duration: 3000, // Thời gian hiển thị (ms)
      newWindow: true, // Mở toast trong cửa sổ mới
      close: true, // Hiển thị nút đóng toast
      gravity: "top", // Vị trí hiển thị toast
      position: "end", // Canh lề của toast
    }).showToast();
  }
  setupTime.value = null;
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

// Initialize empty arrays to store labels and data values
const labels = [],
  labels_1 = [];
const dataValues = [],
  dataValues_1 = [];

// Initialize the Chart.js instance
const myChart = new Chart(document.getElementById("chartjs-0"), {
  type: "line",
  data: {
    labels: labels,
    datasets: [
      {
        label: "nhiệt độ ",
        data: dataValues,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        lineTension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Function to add new data

const myChart_2 = new Chart(document.getElementById("chartjs-1"), {
  type: "line",
  data: {
    labels: labels_1,
    datasets: [
      {
        label: "độ ẩm ",
        data: dataValues_1,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        lineTension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

function addData(value, value_1) {
  // Add current timestamp as label
  const currentTime = new Date();
  labels.push(currentTime.toLocaleTimeString());
  labels_1.push(currentTime.toLocaleTimeString());
  // Add the provided value to dataValues
  dataValues.push(value);
  dataValues_1.push(value_1);

  // Limit the number of data points displayed on the chart
  const maxDataPoints = 30;
  if (labels.length > maxDataPoints) {
    labels.shift();
    dataValues.shift();
    labels_1.shift();
    dataValues_1.shift();
  }

  // Update chart data
  myChart.data.labels = labels.slice(); // Create a copy of labels array
  myChart.data.datasets[0].data = dataValues.slice(); // Create a copy of dataValues array
  myChart_2.data.labels_1 = labels_1.slice();
  myChart_2.data.datasets[0].data = dataValues_1.slice();
  // Update the chart
  myChart.update();
  myChart_2.update();
}
