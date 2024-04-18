const express = require("express");
const cors = require("cors");
const mqtt = require("mqtt");
const mysql = require("mysql");

const option = {
  host: "5becba34c368460ba7657c804a6e4eed.s2.eu.hivemq.cloud",
  username: "bé_thu",
  password: "Thanh2412",
  port: 8883,
  protocol: "mqtts",
};

const DataMysql = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "esp32",
});

const app = express();
app.use(cors());
const Client = mqtt.connect(option);

// function handleConnectMySQL() {
//   DataMysql.connect((err) => {
//     if (err) {
//       console.log("Lỗi khi kết nối đến cơ sở dữ liệu:", err);
//       setTimeout(handleConnectMySQL, 1000);
//     }
//     console.log("Đã kết nối đến cơ sở dữ liệu!");
//   });

//   DataMysql.on("error", (err) => {
//     console.log("Lỗi cơ sở dữ liệu", err);
//     if (err.code === "PROTOCOL_CONNECTION_LOST") {
//       handleConnectMySQL();
//     } else {
//       throw err;
//     }
//   });
// }
// handleConnectMySQL();

Client.on("connect", () => {
  Client.subscribe("data", (err) => {
    if (err) {
      console.log("Lỗi khi subscribe sensor/update topic", err);
    } else console.log("Đã subscribe sensor/update topic");
  });
  Client.subscribe("setTemp", (err) => {
    if (err) {
      console.log("Lỗi khi subscribe sensor/update topic", err);
    } else console.log("Đã subscribe sensor/update topic");
  });
});

Client.on("message", (topic, message) => {
  const msg = message.toString();
  console.log("[Topic arrived] " + topic);
  console.log("[Message arrived] " + msg);
  switch (topic) {
    case "data":
      const data = JSON.parse(msg);
      console.log(data);
      break;
    case "setTemp":
      const setTemp = JSON.parse(msg);
      console.log("temp");
      console.log(setTemp);
      break;
    default:
      break;
  }
});

const server = app.listen(3000, () => {
  console.log(`Server đang chạy → PORT ${server.address().port}`);
});
