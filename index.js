const http = require("http");
const fs = require("fs");
const requests = require("requests");

const home = fs.readFileSync("./home.html", "utf-8");

const replaceVal = (tempval, orgval) => {
  let temp = tempval.replace("{%tempval%}", orgval.main.temp);
  temp = temp.replace("{%tempmin%}", orgval.main.temp_min);
  temp = temp.replace("{%tempmax%}", orgval.main.temp_max);
  temp = temp.replace("{%location%}", orgval.name);
  temp = temp.replace("{%country%}", orgval.sys.country);
  temp = temp.replace("%tempstatus%", orgval.weather[0].main);
  return temp;
};
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=puri&appid=a8d79544208b94b2506998366bbed205"
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        const actualData = arrData.map((val) => replaceVal(home, val)).join("");
        //   console.log(actualData);
        res.write(actualData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});

server.listen(9000, "127.0.0.1", () => {
  console.log("connected to port no 9000");
});
