const { writeFile, readFileSync, readFile } = require("fs");
const { createServer } = require("http");
const https = require("https");

const dataFileName = "instagram-data.json";
const PORT = 3000;
let accessToken = '';

readFile('access-token.txt', {encoding : "utf-8"}, (error, data) => accessToken = data || console.log( new Date().toLocaleTimeString() + error));

setInterval(() =>
    https.get(
      `https://graph.instagram.com/17841401243459210/media?fields=media_type,media_url,permalink,timestamp,caption&limit=12&access_token=${accessToken}`,
      (res) => {
        let data = "";
        res.setEncoding("utf-8");
        res.on("data", (chunk) => (data += chunk));

        res.on("end", () =>
          writeFile(dataFileName, data, (error) =>
            console.log(error || new Date().toLocaleTimeString() + " Instagram data written successfully"
            )))}),
  60000);

createServer((req, res) => {
  let instagramData = readFileSync(dataFileName, {encoding: "utf-8"});
  instagramData = JSON.parse(instagramData).data;

  res.end(JSON.stringify(instagramData));
}).listen(PORT)
  .on("listening", () =>
    console.log(new Date().toLocaleTimeString() + " Listening on port " + PORT)
  );