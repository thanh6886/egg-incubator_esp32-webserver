const express = require("express");
const cors = require("cors");
const mqtt = require("mqtt");
const mysql = require("mysql");
const bodyParser = require("body-parser");

// Sử dụng bodyParser để phân tích dữ liệu JSON từ yêu cầu

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
  database: "mqtt_esp32",
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
const Client = mqtt.connect(option);

function handleConnectMySQL() {
  DataMysql.connect((err) => {
    if (err) {
      console.log("Lỗi khi kết nối đến cơ sở dữ liệu:", err);
      setTimeout(handleConnectMySQL, 1000);
    }
    console.log("Đã kết nối đến cơ sở dữ liệu!");
  });

  DataMysql.on("error", (err) => {
    console.log("Lỗi cơ sở dữ liệu", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleConnectMySQL();
    } else {
      throw err;
    }
  });
}
handleConnectMySQL();

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
      INSERT_DATA(data);
      break;
    case "setTemp":
      const setTemp = JSON.parse(msg);
      console.log("temp");
      console.log(setTemp);
      break;
    case "Motor":
      const Motor = JSON.parse(msg);
      console.log("Motor");
      console.log(Motor);
      break;
    default:
      break;
  }
});

function INSERT_DATA(value) {
  const DataSQL = `INSERT INTO esp32 (datetime, temperature, humidity,Light, FAN_A, FAN_B, Motor) VALUES ( NOW(),${value.temperature}, ${value.humidity},${value.Light}, ${value.FAN_A}, ${value.FAN_B},  ${value.Motor})`;
  DataMysql.query(DataSQL, [value], function (err, result) {
    if (err) {
      console.log("Lỗi khi chèn dữ liệu cảm biến:", err);
    } else {
      console.log("Chèn dữ liệu  thành công từ sensor");
    }
  });
}

app.get("/data", (req, res) => {
  const database = "SELECT * FROM esp32";
  DataMysql.query(database, (err, result) => {
    if (err) throw err;
    res.send({ data: result });
  });
});

app.post("/Temp", (req, res) => {
  const val = req.body.value;
  Client.publish("setTemp", JSON.stringify(val), (err) => {
    if (err) {
      console.error("Error sending data to ESP32:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json({ message: "Data sent to ESP32 successfully" });
    }
  });
  console.log("topic", val);
});
app.post("/Motor", (req, res) => {
  const val = req.body.value;
  Client.publish("Motor", JSON.stringify(val), (err) => {
    if (err) {
      console.error("Error sending data to ESP32:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json({ message: "Data sent to ESP32 successfully" });
    }
  });
  console.log("topic", val);
});

const server = app.listen(3000, () => {
  console.log(`Server đang chạy → PORT ${server.address().port}`);
});
